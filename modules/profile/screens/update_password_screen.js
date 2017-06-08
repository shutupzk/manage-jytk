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
    if (error) return this.popup.alert(error)
    return Router.push('/profile')
  }
  render () {
    return (<div className='container'>
      <div style={styles.list}>
        <div style={styles.item} key={'oldpassword'}>
          <span style={styles.textLeft}>&nbsp;原密码 </span>
          <input placeholder={'输入现有密码'} className='textInput' style={{width: '60%'}} type='password'
            onChange={(e) => this.setState({ oldpassword: e.target.value })} />
        </div>
        <div style={styles.item} key={'newpassword'}>
          <span style={styles.textLeft}> &nbsp;新密码 </span>
          <input placeholder={'设置新密码，不少于六位'} className='textInput' style={{width: '60%'}} type='password'
            onChange={(e) => this.setState({ newpassword: e.target.value })} />
        </div>
        <div style={styles.item} key={'repassword'}>
          <span style={styles.textLeft}>{'再次输入'}</span>
          <input placeholder={'再次输入新密码'} className='textInput' style={{width: '60%'}} type='password'
            onChange={(e) => this.setState({ repassword: e.target.value })} />
        </div>
      </div>
      <button
        style={{width: '100%', display: 'block'}}
        className='blockPrimaryBtn'
        onClick={() => this.submit(this.props)}
      >
        完成
      </button>
    </div>)
  }
}

const styles = {
  container: {
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
    flex: 3,
    borderBottomWidth: 0,
    marginRight: 15
  },
  buttonStyle: {
    marginTop: 35
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
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

export default connect(mapStateToProps, { updatePassword })(UpdatePasswordScreen)
