import React, { Component } from 'react'
import {HOSPITAL_NAME, HOME_PAGE} from 'config'
import {HeaderBar, Loading} from 'components'
import Router from 'next/router'
import { signin, showPrompt } from 'ducks'
import { connect } from 'react-redux'
import localforage from 'localforage'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.autoSignin()
  }

  // 自动登陆，
  async autoSignin () {
    // const error = await this.props.signin({ username: null, password: null })
    // if (error) {
    //   this.props.showPrompt({text: error})
    //   Router.push('/signin')
    // }
    // const adminId = this.props.adminId
    // if (adminId) {
    //   Router.push(HOME_PAGE.url)
    // } else {
    //   Router.push('/signin')
    // }
    const token = await localforage.getItem('token')
    if (token) {
      Router.push(HOME_PAGE.url)
    } else {
    }
  }

  render () {
    if (this.props.loading) {
      return (<Loading showLoading />)
    }
    return (
      <div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    adminId: state.user.data.id,
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, { signin, showPrompt })(Home)
