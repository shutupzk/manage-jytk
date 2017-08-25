import React, { Component } from 'react'
import { hidePrompt } from 'ducks'
import { connect } from 'react-redux'
let timer;

class Prompt extends Component {
  constructor (props) {
    super(props)
    this.state = {
      closeTime: 2,
      autoClose: false,
      show: false,
      promptContent: ''
    }
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text) {
      this.setState({show: true});
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.setState({show: false});
        this.props.hidePrompt()
      }, nextProps.timer);
    }
  }

  componentWillUpdate() {
    // console.log('-------prompt=====', this.props.text, this.props.timer, this.state.show)
    // if (this.state.show) {
    //   clearTimeout(timer);
    //   timer = setTimeout(() => {
    //     this.setState({show: false});
    //   }, this.props.timer);
    // }
  }

  componentWillUnMount() {
    clearTimeout(timer);
  }

  // componentWillReceiveProps (nextProps) {
  //   this.setState(nextProps)
  //   if (nextProps.autoClose) {
  //     let i = nextProps.closeTime
  //     this.interval = setInterval(() => {
  //       if (i === 0) {
  //         clearInterval(this.interval)
  //         this.setState({ isShow: false, promptContent: '' })
  //       }
  //       i--
  //     }, 1000)
  //   }
  // }

  render () {
  // const width = window.screen.availHeight
  // const height = window.screen.availWidth
    // console.log('-----prompt', this.props.children)
    return (
      <div className={`promptDiv ${this.state.show === true ? 'show' : ''}`}>
        {this.props.text}
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
        `}
        </style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    text: state.prompt.data.text,
    timer: state.prompt.data.timer
  }
}

export default connect(mapStateToProps, { hidePrompt })(Prompt)