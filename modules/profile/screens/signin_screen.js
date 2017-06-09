import React, { Component } from 'react'
import Link from 'next/link'
import swal from 'sweetalert2'

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
      swal('', '请输入正确的账号')
      return
    }
    if (!password) {
      swal('', '请输入密码')
      return
    }
    this.setState({animating: true})
    const error = await this.props.signin({ username, password })
    this.setState({animating: false})
    if (error) return swal('', '用户名或密码错误')
    await this.props.queryUser(this.props.client, { userId: this.props.userId })
    await this.props.queryPatients(this.props.client, { userId: this.props.userId })
    // return this.props.navigation.goBack(null)
    window.location.href = '/'
  }
  render () {
    return (<div style={styles.container}>
      <div style={styles.list}>
        <div style={styles.item} key={'username'}>
          <span style={styles.textLeft}>账号:</span>
          <input placeholder={'请输入您的手机号'} className='textInput' style={{width: '70%'}}
            onChange={(e) => this.setState({ username: e.target.value })} value={this.state.username} />
        </div>
        <div style={styles.item} key={'password'}>
          <span style={styles.textLeft}>密码:</span>
          <input placeholder={'请输入密码'} style={styles.TextInput} type='password'
            onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
          <a><span>忘记密码?</span></a>
        </div>
      </div>
      <button
        style={{width: '90%', display: 'block', backgroundColor: '#3CA0FF', height: '40px', borderRadius: '10px', fontSize: 16}}
        onClick={() => this.submit(this.props)}
      >
        登录
      </button>
      <Link href='/signup'>
        <a style={{fontSize: 13, textAlign: 'center', marginTop: '20px'}}><div>没有账号? 去注册</div></a>
      </Link>
    </div>)
  }
}

const styles = {
  container: {
    flex: 1,
    marginLeft: '5%',
    marginTop: '20px'
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
    lineHeight: '30px',
    // width: '70%',
    height: '30',
    borderRadius: '5px',
    marginRight: 15
  },
  buttonStyle: {
    marginTop: 35
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
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, { signin, queryUser, queryPatients })(SigninScreen)
