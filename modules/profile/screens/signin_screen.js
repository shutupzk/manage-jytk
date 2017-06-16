import React, { Component } from 'react'
import Link from 'next/link'
// import swal from 'sweetalert2'

// import { SubButton } from '../components'
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
    return (<div>
      <div>
        <div className={'item'} key={'username'}>
          <span className={'textLeft'}>账号:</span>
          <input placeholder={'请输入您的手机号'} className='textInput' style={{width: '70%'}}
            onChange={(e) => this.setState({ username: e.target.value })} value={this.state.username} />
        </div>
        <div className={'item'} key={'password'}>
          <span className={'textLeft'}>密码:</span>
          <input placeholder={'请输入密码'} className={'TextInput'} type='password'
            onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
          <a><span>忘记密码?</span></a>
        </div>
      </div>
      <button
        style={{width: '92%', margin: '4%', display: 'block', backgroundColor: '#3CA0FF', height: '40px', borderRadius: '10px', fontSize: 16}}
        onClick={() => this.submit(this.props)}
      >
        登录
      </button>
      <Link href='/signup'>
        <a style={{fontSize: 13, textAlign: 'center', marginTop: '20px'}}><div>没有账号? 去注册</div></a>
      </Link>
      <style jsx>{`
        .item {
          padding: 10px;
          flex-wrap: nowrap;
          align-items: center;
          flex-direction: row;
          background-color: #ffffff;
          justify-content: space-between;
          border-bottom: solid 1px; #E6E6E6;
        }
        .textLeft {
          flex: 1;
          font-size: 16px;
          color: #505050;
          margin-left: 15px;
        }
        .TextInput {
          flex: 3;
          border-bottom: 0px;
          line-height: 30px;
          height: 30px;
          border-radius: 5px;
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
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, { signin, queryUser, queryPatients })(SigninScreen)
