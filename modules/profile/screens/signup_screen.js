import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import swal from 'sweetalert2'

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
      buttonTitle: '获取验证码',
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
      return swal('', '请输入手机号')
    }
    if (phone.length !== 11) {
      return swal('', '手机号格式不正确')
    }
    if (!verCode) {
      return swal('', '请输入验证码')
    }
    if (verCode !== '1234') {
      return swal('', '验证码输入错误')
    }
    if (!password) {
      return swal('', '请输入密码')
    }
    if (password.length < 8) {
      return swal('', '密码长度不能小于8位')
    }
    if (password !== repassword) {
      return swal('', '密码输入不一致，请重新输入')
    }
    props.savePhone({ phone, password })
    // const { navigate } = props.navigation
    // window.location.href = '/signup_compelete'
    // Router.pushRoute('signup_compelete')
    Router.push('/signup/signup_compelete')
  }

  render () {
    return (<div style={styles.container}>
      <div style={styles.list}>
        <div style={styles.item} key={'username'}>
          <span style={styles.textLeft}> &nbsp;账&nbsp; 号: </span>
          <input placeholder={'请输入您的手机号'} className='textInput' style={{width: '60%'}}
            onChange={(e) => this.setState({ phone: e.target.value })} value={this.state.phone} />
        </div>
        <div style={styles.item} key={'verCode'}>
          <span style={styles.textLeft}>验 证 码: </span>
          <input placeholder={'请输入验证码'} className='textInput'
            onChange={(e) => this.setState({ verCode: e.target.value })} value={this.state.verCode} />
          <button style={{display: 'inline', marginLeft: '5px', height: '30px'}}
            onClick={() => { this.sendCode(this.props) }} disabled={this.state.clickable} >
            <span>{this.state.buttonTitle}</span>
          </button>
        </div>
        <div style={styles.item} key={'password'}>
          <span style={styles.textLeft}> &nbsp;密&nbsp; 码: </span>
          <input placeholder={'8-18位，同时包含数字和字母'} className='textInput' style={{width: '60%'}} type='password'
            onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
        </div>
        <div style={styles.item} key={'repassword'}>
          <span style={styles.textLeft}>再次输入: </span>
          <input placeholder={'再次输入密码'} className='textInput' style={{width: '60%'}} type='password'
            onChange={(e) => this.setState({ repassword: e.target.value })} value={this.state.repassword} />
        </div>
      </div>
      <button
        style={{width: '90%', display: 'block', backgroundColor: '#3CA0FF', height: '40px', borderRadius: '10px', fontSize: 16}}
        onClick={() => this.submit(this.props)}
      >
        下一步
      </button>
      {/* <Popup ref={popup => { this.popup = popup }} /> */}
    </div>)
  }
}

const styles = {
  container: {
    marginLeft: '5%',
    marginTop: '20px',
    flex: 1
  },
  list: {
    borderTopWidth: 0,
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 0
  },
  item: {
    height: 51,
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1
  },
  textLeft: {
    flex: 1,
    fontSize: 16,
    color: '#505050',
    marginLeft: 15
  },
  TextInput: {
    flex: 2,
    borderBottomWidth: 0,
    marginRight: 15
  },
  buttonStyle: {
    marginTop: 35
  },
  rightView: {
    flex: 1
  },
  sendButton: {
    height: 30,
    width: 60
  },
  sendText: {
    fontSize: 10,
    color: '#ffffff'
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    height: 80
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
