import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {UI} from './UI'


export default class DraftCard extends Component {
  constructor(props) {
    super(props);
    const html = props.defaultValue || '<p>123</p>'
    const contentBlock = process.browser ? htmlToDraft(html) : '';
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={(editorState) => {
            this.setState({editorState})
            this.props.onEditorStateChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
        {UI()}
      </div>
    );
  }
}