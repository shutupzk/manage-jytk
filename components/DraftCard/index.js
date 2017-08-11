import React, { Component } from 'react'
import {theme} from 'components'
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import UI from './UI'

export default class DraftCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
			editorState: EditorState.createEmpty()
    }
  }
  render () {
    return (
			<div style={{fontSize: theme.fontsize, marginBottom: theme.tbmargin}}>
				<Editor
          editorState={this.state.editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={(editorState) => {
						this.setState({
							editorState
						}, () => {
							this.props.onEditorStateChange(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())))
						});
					}}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))}
        /> */}
				 {UI()} 
			</div>
    )
  }
}