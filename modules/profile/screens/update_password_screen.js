import React, { Component } from 'react'
import Router from 'next/router'
import { updatePassword, showPrompt } from '../../../ducks'
import { connect } from 'react-redux'
import {theme, Prompt} from 'components'
import {HOME_PAGE} from 'config'

/**
 * 修改密码
 */
class UpdatePasswordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  // 提交
  async submit (props) {
    const password = props.user.password
    console.log('password', password)
    const oldpassword = this.state.oldpassword
    const newpassword = this.state.newpassword
    const repassword = this.state.repassword
    if (oldpassword !== password) {
      this.props.showPrompt({text: '原密码错误'})
      return
    }
    if (!newpassword || newpassword.length < 6) {
      this.props.showPrompt({text: '密码不能小于6位'})
      return
    }
    if (newpassword !== repassword) {
      this.props.showPrompt({text: '新密码输入不一致，请重新输入'})
      return
    }
    const adminId = props.adminId
    const error = await props.updatePassword(props.client, { adminId, password: newpassword })
    if (error) return this.props.showPrompt({text: error})
    Router.push(HOME_PAGE.url)
  }
  render () {
    return (<div style={{width: '40%', margin: '0 auto'}}>
      <div className='loginPageText'>
        <section className={'flex tb-flex'} key={'oldpassword'}>
          <label htmlFor='oldPassword' className='textLeft'>输入原密码 </label>
          <input id='oldPassword' placeholder={'输入现有密码'} className='textInput' type='password'
            value={this.state.oldpassword}
            onChange={(e) => this.setState({ oldpassword: e.target.value })} />
        </section>
        <section className={'flex tb-flex'} key={'newpassword'}>
          <label htmlFor='password' className='textLeft'>输入新密码</label>
          <input id='password' placeholder={'设置新密码，不少于六位'} className='textInput' type='password'
            value={this.state.newpassword}
            onChange={(e) => this.setState({ newpassword: e.target.value })} />
        </section>
        <section className={'flex tb-flex'} key={'repassword'}>
          <label htmlFor='newPassword' className='textLeft'>{'确认新密码'}</label>
          <input id='newPassword' placeholder={'再次输入新密码'} className='textInput' type='password'
            value={this.state.repassword}
            onChange={(e) => this.setState({ repassword: e.target.value })} />
        </section>
      </div>
      <footer style={{margin: '30px 0'}}>
        <button
          onClick={() => this.setState({oldpassword: '', newpassword: '', repassword: ''})}>重置</button>
        <button
          onClick={() => this.submit(this.props)}>完成</button>
      </footer>
      <style jsx>{`
        .loginPageText{
          background: #fff;
          margin: .2rem ${theme.tbmargin} 0;
        }
        .loginPageText section{
          height: .46rem;
          line-height: .46rem;
          color: ${theme.mainfontcolor};
        }
        .loginPageText input{
          background: transparent;
          border: none;
          line-height: .46rem;
          font-size: ${theme.fontsize};
          padding-left: .06rem;
          border-radius: 0;
          margin-left: .1rem;
          border: 1px solid ${theme.bordercolor};
        }
        .loginPageBtnItem {
          margin: .25rem 0 .1rem;
        }
        button {
          border: 1px solid ${theme.bordercolor};
          background-image: linear-gradient(-180deg,#fefefe,#fbfbfb);
          margin: 0 .15rem;
          line-height: .36rem;
          padding: 0 .3rem;
          font-size: .16rem;
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
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, { updatePassword,showPrompt })(UpdatePasswordScreen)
