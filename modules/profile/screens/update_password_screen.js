import React, { Component } from 'react'
import Router from 'next/router'
import { updatePassword } from '../../../ducks'
import { connect } from 'react-redux'
import swal from 'sweetalert2'

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
      return swal({
        text: '原密码错误'
        // type: 'error',
        // width: '260px',
        // confirmButtonText: '知道了',
        // showCloseButton: true,
        // timer: 3000,
        // background: '#fff'
      })
      // swal('Good job!', 'You clicked the button!', 'success')
      // return
    }
    if (!newpassword || newpassword.length < 6) {
      return swal('密码不能小于6位')
    }
    if (newpassword !== repassword) {
      return swal('新密码输入不一致，请重新输入')
    }
    this.setState({animating: true})
    const userId = props.userId
    const error = await props.updatePassword(props.client, { userId, password: newpassword })
    if (error) return swal('', error)
    return Router.push('/profile')
  }
  render () {
    return (<div className=''>
      <div className='list'>
        <div className='item' key={'oldpassword'}>
          <span className='textLeft'>&nbsp;原密码 </span>
          <input placeholder={'输入现有密码'} className='textInput' style={{width: '60%'}} type='password'
            onChange={(e) => this.setState({ oldpassword: e.target.value })} />
        </div>
        <div className='item' key={'newpassword'}>
          <span className='textLeft'> &nbsp;新密码 </span>
          <input placeholder={'设置新密码，不少于六位'} className='textInput' style={{width: '60%'}} type='password'
            onChange={(e) => this.setState({ newpassword: e.target.value })} />
        </div>
        <div className='item' key={'repassword'}>
          <span className='textLeft'>{'再次输入'}</span>
          <input placeholder={'再次输入新密码'} className='textInput' style={{width: '60%'}} type='password'
            onChange={(e) => this.setState({ repassword: e.target.value })} />
        </div>
      </div>
      <button
        style={{width: '90%', display: 'block', margin: '5%'}}
        className='blockPrimaryBtn'
        onClick={() => this.submit(this.props)}
      >
        完成
      </button>
      <style jsx>{`
        .list {
          margin-bottom: 20px;
        }
        .item {
          padding: 10px;
          margin-bottom: 1px;
          background-color: #fff;
          display: flex;
        }
        .textLeft {
          flex: 3;
          font-size: 16px;
          color: #505050;
          margin-left: 10px;
        }
        .textInput {
          flex: 7;
          margin-right: 15px;
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
