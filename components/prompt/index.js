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
    return (
      <div className={`promptDiv ${this.state.isShow === true ? 'show' : ''}`}>
        {
          this.props.children
        }
        <style jsx>{`
          .promptDiv {
            background-color: #888;
            color: #fff;
            padding: 10px;
            z-index: 999;
            position: fixed;
            width:260px;
            position:absolute;
            border-radius: 5px;
            left: 50%;
            top: 50%;
            margin-left:-140px;
            margin-top:-50px;
            display: none;
            text-align: center;
            align-items: center;
          }
          .show {
            display: block !important;
          }
        `}</style>
      </div>
    )
  }
}
