import React, { Component } from 'react'

export default class QuestionList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }
  render () {
    const question = this.props.question
    const num = this.props.num
    return (
      <div key={question.id}>
        <div style={{backgroundColor: '#ffffff', padding: 10, marginBottom: 1}}
          onClick={() => { this.setState({open: !this.state.open}) }}
        >
          {num},{question.title}
          <span style={{float: 'right', padding: '0px 5px'}}>
            {!this.state.open ? '>' : <img src='/static/icons/down.png' style={{width: 10, height: 10}} />}
          </span>
        </div>
        {
          this.state.open
          ? <div style={{backgroundColor: '#ffffee', padding: 15, marginBottom: 1}}>{question.content}</div>
          : ''
        }
      </div>
    )
  }
}
