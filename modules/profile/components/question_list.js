import React, { Component } from 'react'
import {theme} from 'components'

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
        <div style={{backgroundColor: '#fff', padding: theme.lrmargin, borderBottom: '1px solid #fff', borderColor: theme.bordercolor,
          justifyContent: 'space-between', color: theme.mainfontcolor}}
          className='flex tb-flex'
          onClick={() => { this.setState({open: !this.state.open}) }}
        >
          {num},{question.title}
          {!this.state.open ?
            <p style={{transform: 'rotate(135deg)'}} className='back-left'></p>
          : <p style={{transform: 'rotate(45deg)'}} className='back-left'></p>
          }
        </div>
        {
          this.state.open
          ? <div style={{backgroundColor: '#fbfbfb', padding: 15, borderBottom: '1px solid #fff', borderColor: theme.bordercolor}}>{question.content}</div>
          : ''
        }
      </div>
    )
  }
}
