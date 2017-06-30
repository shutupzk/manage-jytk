import React, { Component } from 'react'
import Router from 'next/router'
import { updatePassword } from '../../../ducks'
import { connect } from 'react-redux'
import {theme} from 'components'

/**
 * 修改密码
 */
class UpdatePasswordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animating: false
    }
  }

  // 提交
  async submit (props) {
    const password = props.user.password
    const oldpassword = this.state.oldpassword
    const newpassword = this.state.newpassword
    const repassword = this.state.repassword
    if (oldpassword !== password) {
      // return swal({
      //   text: '原密码错误'
      //   // type: 'error',
      //   // width: '260px',
      //   // confirmButtonText: '知道了',
      //   // showCloseButton: true,
      //   // timer: 3000,
      //   // background: '#fff'
      // })
      // swal('Good job!', 'You clicked the button!', 'success')
      return console.log('原密码错误')
    }
    if (!newpassword || newpassword.length < 6) {
      return console.log('密码不能小于6位')
    }
    if (newpassword !== repassword) {
      return console.log('新密码输入不一致，请重新输入')
    }
    this.setState({animating: true})
    const userId = props.userId
    const error = await props.updatePassword(props.client, { userId, password: newpassword })
    if (error) return console.log('', error)
    return Router.push('/profile')
  }
  render () {
    return (<div className=''>
      <div className='loginPageText'>
        <section className={'flex tb-flex'} key={'oldpassword'}>
          <span className='textLeft'>原密码 </span>
          <input placeholder={'输入现有密码'} className='textInput' type='password'
            onChange={(e) => this.setState({ oldpassword: e.target.value })} />
        </section>
        <section className={'flex tb-flex'} key={'newpassword'}>
          <span className='textLeft'>新密码 </span>
          <input placeholder={'设置新密码，不少于六位'} className='textInput' type='password'
            onChange={(e) => this.setState({ newpassword: e.target.value })} />
        </section>
        <section className={'flex tb-flex'} key={'repassword'}>
          <span className='textLeft'>{'再次输入'}</span>
          <input placeholder={'再次输入新密码'} className='textInput' type='password'
            onChange={(e) => this.setState({ repassword: e.target.value })} />
        </section>
      </div>
      <footer style={{margin: '10px 15px'}}>
        <button
          className='btnBG btnBGMain loginPageBtnItem'
          onClick={() => this.submit(this.props)}>完成</button>
      </footer>
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

export default connect(mapStateToProps, { updatePassword })(UpdatePasswordScreen)
