import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
// import console.log from 'sweetalert2'
import {theme} from 'components'

import { savePhone } from '../../../ducks'
import { connect } from 'react-redux'

/**
 * 修改密码
 */
class SignupScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animating: false,
      buttonTitle: '获取',
      clickable: false
    }
  }

  // 发送验证码
  sendCode () {
    let i = 10
    this.setState({ buttonTitle: `${i}s`, clickable: true })
    this.interval = setInterval(() => {
      this.setState({ buttonTitle: `${i}s` })
      if (i === 0) {
        clearInterval(this.interval)
        this.setState({ buttonTitle: '获取验证码', clickable: false })
      }
      i--
    }, 1000)
  }

  // 提交
  submit (props) {
    const password = this.state.password
    const verCode = this.state.verCode
    const phone = this.state.phone
    const repassword = this.state.repassword
    if (!phone) {
      return console.log('', '请输入手机号')
    }
    if (phone.length !== 11) {
      return console.log('', '手机号格式不正确')
    }
    if (!verCode) {
      return console.log('', '请输入验证码')
    }
    if (verCode !== '1234') {
      return console.log('', '验证码输入错误')
    }
    if (!password) {
      return console.log('', '请输入密码')
    }
    if (password.length < 8) {
      return console.log('', '密码长度不能小于8位')
    }
    if (password !== repassword) {
      return console.log('', '密码输入不一致，请重新输入')
    }
    props.savePhone({ phone, password })
    // const { navigate } = props.navigation
    // window.location.href = '/signup_compelete'
    // Router.pushRoute('signup_compelete')
    Router.push('/signup/signup_compelete')
  }

  render () {
    return (<div>
      <div className='loginPageText'>
        <section className={'flex tb-flex'} key={'username'}>
          <span className={'textLeft'}> &nbsp;账&nbsp; 号: </span>
          <input placeholder={'请输入您的手机号'} className='textInput'
            onChange={(e) => this.setState({ phone: e.target.value })} value={this.state.phone} />
        </section>
        <section className={'flex tb-flex towBtn'} key={'verCode'}>
          <article className='flex tb-flex'>
            <span className={'textLeft'}>验 证 码: </span>
            <input placeholder={'请输入验证码'} className='textInput'
              onChange={(e) => this.setState({ verCode: e.target.value })} value={this.state.verCode} />
          </article>
          <button className='btnBG btnBGLitt btnBGMain'
            onClick={() => { this.sendCode(this.props) }} disabled={this.state.clickable} >
            {this.state.buttonTitle}
          </button>
        </section>
        <section className={'flex tb-flex'} key={'password'}>
          <span className={'textLeft'}> &nbsp;密&nbsp; 码: </span>
          <input placeholder={'8-18位，同时包含数字和字母'} className='textInput' type='password'
            onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
        </section>
        <section className={'flex tb-flex'} key={'repassword'}>
          <span className={'textLeft'}>再次输入: </span>
          <input placeholder={'再次输入密码'} className='textInput' type='password'
            onChange={(e) => this.setState({ repassword: e.target.value })} value={this.state.repassword} />
        </section>
      </div>
      <footer style={{margin: '10px 15px'}}>
        <button
          className='btnBG btnBGMain loginPageBtnItem'
          onClick={() => this.submit(this.props)}>下一步</button>
      </footer>
      {/* <Popup ref={popup => { this.popup = popup }} /> */}
      <style jsx>{`
          .loginPageText{
            background: #fff;
            margin: ${theme.tbmargin} 0;
            padding: 0 ${theme.lrmargin};
            border-top: 1px solid ${theme.bordercolor};
            border-bottom: 1px solid ${theme.bordercolor};
          }
          .loginPageText section{
            height: .46rem;
            line-height: .46rem;
            color: ${theme.mainfontcolor};
            border-top: 1px solid ${theme.bordercolor};
          }
          .loginPageText section:first-child{
            border-top: 1px solid #fff;
          }
          .loginPageText .towBtn{
            justify-content: space-between;
          }
          .loginPageText input{
            background: transparent;
            border: none;
            line-height: .46rem;
            font-size: ${theme.fontsize};
            padding-left: .06rem;
          }
          .loginPageBtnItem {
            margin: .25rem 0 .1rem;
          }
          .loginPage .loginpagelogo{
            width: 50%;
            position: fixed;
            bottom: .5rem;
            left: 25%;
          }
    `}</style>
    </div>)
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    user: state.user.data,
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, { savePhone })(SignupScreen)
