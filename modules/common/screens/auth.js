import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signin, queryUser } from '../../../ducks'

export default function (ComposedComponent) {
  class Authentication extends Component {
    componentWillMount () {
      this.autoSignin()
      if (!this.props.token) {
        this.props.url.push('/')
      }
    }

    async signin () {
      await this.props.signin()
    }

    // 自动登陆 刷新token,用户信息,就诊人信息，
    async autoSignin () {
      console.log('自动登录')
      const error = await this.props.signin({ username: null, password: null })
      if (error) return console.log(error)
      const adminId = this.props.adminId
      if (adminId) {
        this.props.queryUser(this.props.client, { adminId })
      }
    }

    componentWillUpdate (nextProps) {
      if (!nextProps.token) {
        this.props.url.push('/')
      }
    }

    render () {
      console.log(this.props)
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps (state) {
    console.log(state)
    return { token: state.user.data.token }
  }

  return connect(mapStateToProps, { signin, queryUser })(Authentication)
}
