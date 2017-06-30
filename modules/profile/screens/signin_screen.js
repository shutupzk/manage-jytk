import React, { Component } from 'react'
import Link from 'next/link'

import { CardWhite, theme } from 'components'
import { signin, queryUser, queryPatients } from '../../../ducks'
import { connect } from 'react-redux'

class SigninScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animating: false
    }
  }
  async submit () {
    const username = this.state.username
    const password = this.state.password
    if (!username) {
      console.log('', '请输入正确的账号')
      return
    }
    if (!password) {
      console.log('', '请输入密码')
      return
    }
    this.setState({animating: true})
    const error = await this.props.signin({ username, password })
    this.setState({animating: false})
    if (error) return console.log('', '用户名或密码错误')
    await this.props.queryUser(this.props.client, { userId: this.props.userId })
    await this.props.queryPatients(this.props.client, { userId: this.props.userId })
    // return this.props.navigation.goBack(null)
    window.location.href = '/'
  }
  render () {
    return (
      <div className="loginPage">
        <div className="loginPageText">
          <section className={'flex tb-flex'} key={'username'}>
            <span>账号:</span>
            <input placeholder={'请输入您的手机号'}
              onChange={(e) => this.setState({ username: e.target.value })} value={this.state.username} />
          </section>
          <section className={'flex tb-flex'} key={'password'}>
            <article className='flex tb-flex'>
              <span>密码:</span>
              <input placeholder={'请输入密码'} type='password'
                onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
            </article>
            <a><span className='forgetpass'>忘记密码?</span></a>
          </section>
        </div>
        <footer style={{margin: '10px 15px'}}>
          <button
            className='btnBG btnBGMain loginPageBtnItem'
            onClick={() => this.submit(this.props)}>登&nbsp;录</button>
          <Link href='/signup'>
            <a className='registerbtn'>没有账号？去注册→</a>
          </Link>
        </footer>
        <img src={`/static/icons/loginlogo.png`} alt="" className="loginpagelogo" />
        <style jsx>{`
          .registerbtn{
            margin-top: ${theme.lrmargin};
            color: ${theme.maincolor};
            text-align: center;
            display: block;
          }
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
          }
          .loginPageText section:last-child{
            border-top: 1px solid ${theme.bordercolor};
            justify-content: space-between;
          }
          .loginPageText input{
            background: transparent;
            border: none;
            line-height: .46rem;
            font-size: ${theme.fontsize};
            padding-left: .06rem;
          }
          .forgetpass{
            color: ${theme.maincolor};
            font-size: ${theme.nfontsize};
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
