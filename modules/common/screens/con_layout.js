import React, { Component } from 'react'
// import Link from 'next/link'
import { MAINFUNCTION } from '../../../config'
import Router from 'next/router'
import { theme } from '../../../components'
import Navigation from './foot_navigation'
import { signin, showPrompt } from 'ducks'
import { connect } from 'react-redux'
import localforage from 'localforage'

class ConLayout extends Component {
  componentDidMount () {
    this.autoSignin()
  }

  // 自动登陆，
  async autoSignin () {
    const adminId = await localforage.getItem('adminId')
    if (this.props.adminId) {
      // Router.push(HOME_PAGE.url)
    } else if (!this.props.adminId && adminId) {
      const error = await this.props.signin({ username: null, password: null })
      if (error) {
        this.props.showPrompt({ text: error })
      }
    } else {
      Router.push('/signin')
    }
  }
  render () {
    const url = (this.props.url && this.props.url.pathname) || '/'
    // console.log('---ConLayout url', this.props.url && this.props.url.pathname)
    const conList = MAINFUNCTION.filter(item => url.indexOf(item.short_name) > -1)
    const screenHeight = process.browser ? document.documentElement.clientHeight : 1000
    const appConHeight = screenHeight - 126
    return (
      <div className={'appContent'} style={{ background: '#fff' }}>
        <div className={'appContentLeft left'}>
          <Navigation url={url} data={conList[0] && conList[0].children} />
        </div>
        <div className={'right appContentRight'}>
          <div className={'appConRightCon'} style={{ minHeight: appConHeight }}>
            {this.props.children}
          </div>
        </div>
        <div className='clearfix' />
        <style jsx>{`
          .appContentLeft {
            background: ${theme.maincolor};
            width: 12%;
            color: #fff;
            text-align: center;
            height: 100%;
          }
          .appContentLeft:after {
            content: '';
            display: block;
            background: ${theme.maincolor};
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 12%;
          }
          .appContentRight {
            width: 88%;
          }
          .appConRightCon {
            padding: 0.14rem;
          }
        `}</style>
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

export default connect(mapStateToProps, { signin, showPrompt })(ConLayout)
