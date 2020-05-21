const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3001
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.post('/api/send_invitation_email', (request, response) => {
    request.body.to.forEach(function(to) {
        const msg = {
            to: to,
            from: request.body.from,
            subject: 'Invitation',
            text: 'You are invited for note.',
            html: `You are invited for note.<br/></br><a href="${request.body.for}">${request.body.for}</a>`,
        }

        console.log(msg)
        sgMail.send(msg)
    })

    response.send('success!')
})

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})