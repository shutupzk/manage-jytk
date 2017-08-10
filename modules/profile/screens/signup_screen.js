import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt} from 'components'

import { savePhone, sendVerifyCode, checkVerifyCode } from '../../../ducks'
import { connect } from 'react-redux'

/**
 * 修改密码
 */
class SignupScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animating: false,
      phone: '',
      verCode: '',
      buttonTitle: '获取',
      clickable: false,
      closeTime: 2,
      autoClose: true,
      isShow: false,
      promptContent: ''
    }
  }

  // 发送验证码
  async sendCode () {
    let n = 2
    await this.props.sendVerifyCode(this.props.client, {phone: this.state.phone})
    if (this.props.error) {
      this.setState({
        closeTime: 2,
        autoClose: true,
        isShow: true,
        promptContent: '发送失败'
      })
      // this.interval = setInterval(() => {
      //   if (n === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   n--
      // }, 1000)
      return
    }
    let i = 10
    this.setState({ buttonTitle: `${i}s`, clickable: true })
    this.interval = setInterval(() => {
      this.setState({ buttonTitle: `${i}s` })
      if (i === 0) {
        clearInterval(this.interval)
        this.setState({ buttonTitle: '获取', clickable: false })
      }
      i--
    }, 1000)
  }

  // 提交
  async submit (props) {
    let i = 2
    const password = this.state.password
    const code = this.state.verCode
    const phone = this.state.phone
    const repassword = this.state.repassword
    console.log('----code', password, code, phone, repassword)
    if (!phone) {
      this.setState({
        closeTime: 2,
        autoClose: true,
        isShow: true,
        promptContent: '请输入手机号'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
      // return console.log('', '请输入手机号')
    }
    if (phone.length !== 11) {
      this.setState({
        closeTime: 2,
        autoClose: true,
        isShow: true,
        promptContent: '手机号格式不正确'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
    }
    if (!code) {
      this.setState({
        closeTime: 2,
        autoClose: true,
        isShow: true,
        promptContent: '请输入验证码'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
    }
    // if (code !== '1234') {
    //   this.setState({
    //     isShow: true,
    //     promptContent: '验证码输入错误'
    //   })
    //   this.interval = setInterval(() => {
    //     if (i === 0) {
    //       clearInterval(this.interval)
    //       this.setState({ isShow: false, promptContent: '' })
    //     }
    //     i--
    //   }, 1000)
    //   return
    // }
    if (!password) {
      this.setState({
        closeTime: 2,
        autoClose: true,
        isShow: true,
        promptContent: '请输入密码'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
    }
    if (password.length < 8) {
      this.setState({
        closeTime: 2,
        autoClose: true,
        isShow: true,
        promptContent: '密码长度不能小于8位'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
    }
    if (password !== repassword) {
      this.setState({
        closeTime: 2,
        autoClose: true,
        isShow: true,
        promptContent: '密码输入不一致，请重新输入'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
    }
    const error = await props.checkVerifyCode(props.client, {phone, code})
    if (error) {
      this.setState({
        closeTime: 2,
        autoClose: true,
        isShow: true,
        promptContent: error
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
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
          <span className={'textLeft'}>账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:</span>
          <input placeholder={'请输入您的手机号'} className='textInput'
            onChange={(e) => this.setState({ phone: e.target.value })} value={this.state.phone} />
        </section>
        <section className={'flex tb-flex towBtn'} key={'verCode'}>
          <article className='flex tb-flex'>
            <span className={'textLeft'}>验&nbsp;&nbsp;证&nbsp;码:</span>
            <input placeholder={'请输入验证码'} className='textInput'
              onChange={(e) => this.setState({ verCode: e.target.value })} value={this.state.verCode} />
          </article>
          <button className='btnBG btnBGLitt btnBGMain'
            onClick={() => { this.sendCode(this.props) }} disabled={this.state.clickable} >
            {this.state.buttonTitle}
          </button>
        </section>
        <section className={'flex tb-flex'} key={'password'}>
          <span className={'textLeft'}>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:</span>
          <input placeholder={'8-18位，同时包含数字和字母'} className='textInput' type='password'
            onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
        </section>
        <section className={'flex tb-flex'} key={'repassword'}>
          <span className={'textLeft'}>再次输入:</span>
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
      <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
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
    adminId: state.user.data.id,
    user: state.user.data,
    code: state.user.data.code,
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, { savePhone, sendVerifyCode, checkVerifyCode })(SignupScreen)
