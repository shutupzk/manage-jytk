import React, { Component } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import {HOSPITAL_NAME, HOSPITALINFO} from 'config'

import { theme, Prompt, HeaderBar } from 'components'
import { signin, queryUser, queryPatients } from '../../../ducks'
import { connect } from 'react-redux'

class SigninScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animating: false,
      autoClose: true,
      closeTime: 2,
      isShow: false,
      promptContent: ''
    }
  }
  async submit () {
    let i = 2
    const username = this.state.username
    const password = this.state.password
    if (!username) {
      this.setState({
        isShow: true,
        promptContent: '请输入正确的账号'
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
    }
    if (!password) {
      this.setState({
        isShow: true,
        promptContent: '请输入密码'
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
    }
    this.setState({animating: true})
    const error = await this.props.signin({ username, password })
    this.setState({animating: false})
    if (error) {
      this.setState({
        isShow: true,
        promptContent: '用户名或密码错误'
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
    }
    await this.props.queryUser(this.props.client, { userId: this.props.userId })
    await this.props.queryPatients(this.props.client, { userId: this.props.userId })
    // return this.props.navigation.goBack(null)
    // window.location.href = '/'
  }
  render () {
    console.log('----hospital_short_name', HOSPITALINFO)
    return (
      <div className={'loginPage'}>
        <HeaderBar />
        <div className={'loginCon'}>
          <h3
            style={{textAlign: 'center', fontSize: 22, color: theme.mainfontcolor, paddingTop: 50, margin: 0}}>
           {`欢迎使用${HOSPITAL_NAME}！`}</h3>
          <section style={{
                background: 'none',
                height: 'auto',
                paddingTop: 30,
                paddingBottom: 100}}>
            <dl>
              <dt>账号</dt>
              <dd><input type="text" placeholder={'请输入您的手机号'}
                onChange={(e) => this.setState({ username: e.target.value })} value={this.state.username} /></dd>
            </dl>
            <dl>
              <dt>密码</dt>
              <dd>
                <input placeholder={'请输入密码'} type='password'
                  onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
                <a className='right forgetpass flex tb-flex'
                  onClick={() => { Router.push('/profile/forgot_password') }}>
                  <img style={{width: 16, paddingRight: 3}} src={`/static/${HOSPITALINFO.hospital_short_name}/forgetPass.png`} />
                  <span className=''>忘记密码?</span>
                </a>
              </dd>
            </dl>
          </section>
          <button className='btnBG btnBGMain' style={{height: '.52rem'}} onClick={() => this.submit(this.props)}>登录</button>
          <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
        </div>
        <style jsx>{`
          .loginPage {
            background: url('/static/icons/loginBack.png') center no-repeat;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }
          .loginCon{
            background: #FFFFFF;
            box-shadow: 0px 10px 28px 0px rgba(0,0,0,0.30);
            border-radius: 6px;
            width: 30%;
            height: auto;
            margin: 6% auto 0;
            position: relative;
            min-width: 380px;
          }
          dl{
            padding: 0 50px;
          }
          dt{
            font-size: 18px;
            padding-top: 16px;
            line-height: 46px;
            color: ${theme.mainfontcolor};
          }
          dd{
            border-bottom: 1px solid ${theme.bordercolor};
            
          }
          input{
            color: ${theme.mainfontcolor};
            padding: 0; margin: 0; border: none;
            font-size: ${theme.mainfontsize};
            line-height: .24rem;
          }
          .forgetpass{
            color: ${theme.maincolor};
            font-size: ${theme.nfontsize};
            padding-left: 26px;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, { signin, queryUser, queryPatients })(SigninScreen)
