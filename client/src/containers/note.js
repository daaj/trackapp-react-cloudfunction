import React, { Component } from 'react'
import shortid from 'shortid'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { setNoteTitle } from '../firebase/note'
import { getNoteDownloadURL, uploadImage, saveNote } from '../firebase/storage'
import { history } from '../store'

import Header from '../components/header'
import InviteInput from '../components/invite'
import InvitedUsers from '../components/invitedUsers'


const styles = {
    container: {
        display:'flex',
        alignItems:'center',
        flexDirection:'column',
    },
    panel: {
        width:'900px',
    },
    editor: {
        height: '60vh',
        border: '1px solid rgba(50,168,230, 0.3)',
    }
}

class Note extends Component {
     _onBeforeImageAdd() {
        clearInterval(this.intervalId)
    }

    _onImageAdd(event) {
        let image = event.data.el.$
        let file = event.data.file
        const _this = this

        const {noteid} = this.props.match.params
        // const userid = this.props.uid

        let uploadTask = uploadImage(noteid, file)
        uploadTask.on('state_changed',
            ()=>{},
            ()=>{},
            ()=>{
                image.src = uploadTask.snapshot.downloadURL
                _this.startAutoSave()
            }
        )
    }

    _onAutoSave() {
        const {noteid} = this.props.match.params
        // const userid = this.props.uid

        let content = this.editor.get('nativeEditor').getData()
        saveNote(noteid, content)

        let parser = new DOMParser(), title
        try {
            title = parser.parseFromString(`<p>${content}</p>`, "text/xml").firstChild.firstChild.textContent
        } catch (error) {
            // if required depends on node, it doesnt work on client-side, only works on back-end, but query-string works
            // const queryString = require('query-string')
            // const parsed = queryString.parse(this.props.location.search)
            // title = parsed.title
            title = this.props.title
        }

        if( title === '' ) {
            title = 'untitled'
        }

        setNoteTitle(noteid, title)
    }

    startAutoSave() {
        this.intervalId = setInterval(this._onAutoSave.bind(this), 5000)
    }

    loadNote(/*userid,*/ noteid) {
        // if required depends on node, it doesnt work on client-side, only works on back-end, but query-string works
        // const queryString = require('query-string')
        // const parsed = queryString.parse(this.props.location.search)
        // const {title} = parsed
        const title = this.props.title
        const _this = this

        getNoteDownloadURL(noteid).then(function(url) {
            var xhr = new XMLHttpRequest()
            xhr.responseType = 'text'
            xhr.onload = function(event) {
                var domString = xhr.response
                _this.editor.get('nativeEditor').setData(domString)
                _this.startAutoSave()
            }
            xhr.open('GET', url)
            xhr.send()
        }).catch(function(error) {
            console.log('failed loading note')
            _this.editor.get('nativeEditor').setData(title)
            _this.startAutoSave()
        });
    }

    componentDidMount() {
        const {noteid} = this.props.match.params
        // const userid = this.props.uid

        this.loadNote(/*userid,*/ noteid)
        
        this.editor = window.AlloyEditor.editable('editor', {
            readOnly: this.props.role === 'view'
        })

        this.editor.get('nativeEditor').on('imageAdd', this._onImageAdd, this);
        this.editor.get('nativeEditor').on('beforeImageAdd', this._onBeforeImageAdd, this);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)

        this._onAutoSave()
    }

    render() {
        const {noteid} = this.props.match.params
        // const userid = this.props.uid

        return(
            <div className="content" style={styles.container}>
                <Header />
                <div className="panel panel-flat" style={styles.panel}>
                    <div className="panel-heading">
                        <h5 className="panel-title">
                            {/* <Link to={`/users/${userid}`}> */}
                            <Link to={`/note/u/`}>
                                <div className="btn border-grey-800 text-grey-800 btn-flat btn-icon btn-rounded"><i className="icon-home2"></i></div>
                            </Link> &nbsp;&nbsp;&nbsp; Edit Note
                        </h5>
                    </div>
                    <div className="panel-body">
                        <div style={styles.editor} id="editor"></div>
                        {   this.props.role === 'owner' ?
                            <InviteInput style={{marginTop: '20px'}} noteid={noteid}/> :
                            <InvitedUsers noteid={noteid} />
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownprops) => {
    let noteid = ownprops.match.params.noteid
    return {
        uid: state.auth.uid,
        title: !state.notes[noteid] ? 'untitled' :
               !state.notes[noteid].title ? 'untitled' : state.notes[noteid].title,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Note)
