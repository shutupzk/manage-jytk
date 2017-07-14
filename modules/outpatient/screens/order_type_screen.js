import React, { Component } from 'react'
import {theme, RequireLoginCard} from 'components'
import { connect } from 'react-redux'
import { signin } from '../../../ducks'

// import { isEmptyObject } from '../../../utils'
import Router from 'next/router'
class OrderTypeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      payStatus: false,
      selectedId: ''
    }
  }

  componentWillMount () {
    this.autoSignin()
  }

  // 自动登陆 刷新token,用户信息,就诊人信息，
  async autoSignin () {
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId
    if (userId) {
    }
  }

  toPage (key) {
    Router.push('/outpatient?key=' + key)
  }
  render () {
    if (!this.props.token) {
      return (
        <div>
          <span><RequireLoginCard /></span>
        </div>
      )
    }
    return (
      <div className='bottomView'>
        <div
          onClick={() => {
            this.toPage('appointment')
          }}>
          <a className='flex tb-flex'>
            <p className='flex tb-flex'>
              诊察费诊金费用
            </p>
            <i className='back-left'></i>
          </a>
        </div>
        <div
          onClick={() => {
            this.toPage('outpatient')
          }}>
          <a className='flex tb-flex'>
            <p className='flex tb-flex'>
              门诊费用
            </p>
            <i className='back-left'></i>
          </a>
        </div>
        <style jsx>{`
          .bottomView {
            border-top: 1px solid ${theme.bordercolor};
            background: #fff;
            margin-top: ${theme.tbmargin};
          }
          .bottomView a{
            border-bottom: 1px solid ${theme.bordercolor};
            padding: 0 .15rem;
            justify-content: space-between;
          }
          .bottomView p{
            color: ${theme.mainfontcolor};
            line-height: 44px;
          }
          .bottomView i{
            transform: rotate(135deg);
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    token: state.user.data.token
  }
}

export default connect(
  mapStateToProps, {
    signin
  }
)(OrderTypeScreen)
