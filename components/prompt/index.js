import React, { Component } from 'react'
export default class Prompt extends Component {
  constructor (props) {
    super(props)
    this.state = {
      closeTime: 2,
      autoClose: false,
      isShow: false,
      promptContent: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState(nextProps)
    if (nextProps.autoClose) {
      let i = nextProps.closeTime
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
    }
  }

  render () {
  // const width = window.screen.availHeight
  // const height = window.screen.availWidth
    // console.log('-----prompt', this.props.children)
    return (
      <div>
        {
          this.props.children
        }
      </div>
    )
  }
}
