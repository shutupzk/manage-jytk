import React, { Component } from 'react'
import Router from 'next/router'
import swal from 'sweetalert2'

import { signup } from '../../../ducks'
import { connect } from 'react-redux'
import { getBirthday, getSex } from '../../../utils'

/**
 * 修改密码
 */
class SignupCompletionScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sex: '性别',
      birthday: '出生日期',
      animating: false
    }
  }

  // 提交
  async submit () {
    const phone = this.props.user.phone
    const password = this.props.user.password
    const name = this.state.name
    const certificateNo = this.state.certificateNo
    if (!name) {
      return swal('', '姓名不能为空')
    }
    if (!certificateNo) {
      return swal('', '身份证号不能为空')
    }
    if (certificateNo.length !== 18) {
      return swal('', '身份证格式不正确')
    }
    this.setState({animating: true})
    const error = await this.props.signup(this.props.client, { phone, password, certificateNo, name })
    this.setState({animating: false})
    if (error) {
      return swal('', error + '')
    }
    Router.push('/signin')
  }
  render () {
    return (<div style={styles.container}>
      <div style={styles.list}>
        <div style={styles.item} key={'name'}>
          <span style={styles.textLeft}> &nbsp;姓 名 </span>
          <input placeholder={'输入您的真实姓名'} className='textInput' style={{width: '60%'}}
            onChange={(e) => this.setState({ name: e.target.value })} />
        </div>
        <div style={styles.item} key={'certificateNo'}>
          <span style={styles.textLeft}>{'身份证号'}</span>
          <input placeholder={'输入身份证号'} className='textInput' style={{width: '60%'}}
            onChange={(e) => {
              var certificateNo = e.target.value
              if (certificateNo.length === 18) {
                const birthday = getBirthday(certificateNo)
                const sex = getSex(certificateNo)
                const sexText = sex === '0' ? '女' : '男'
                this.setState({ certificateNo, birthday, sexText })
              }
            }} />
        </div>
        <div style={styles.item} key={'sex'}>
          <span style={styles.textLeft}> &nbsp;性 别 </span>
          <input placeholder={'输入身份证号后自动生成'} className='textInput' style={{width: '60%'}} value={this.state.sexText}
            disabled
            />
        </div>
        <div style={styles.item} key={'birthday'}>
          <span style={styles.textLeft}>{'出生日期'}</span>
          <input placeholder={'输入身份证号后自动生成'} className='textInput' style={{width: '60%'}} value={this.state.birthday}
            disabled
            />
        </div>
        <div style={styles.item} key={'carteVital'}>
          <span style={styles.textLeft}>{'医保卡号'}</span>
          <input placeholder={'非医保用户可不填'} className='textInput' style={{width: '60%'}}
            onChange={(e) => this.setState({ carteVital: e.target.value })} />
        </div>
      </div>
      <button
        className='blockPrimaryBtn' style={{width: '90%', display: 'block'}}
        title='完成'
        onClick={() => this.submit()}
        >完成</button>
      {/* <Popup ref={popup => { this.popup = popup }} /> */}
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
    user: state.user.data,
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, { signup })(SignupCompletionScreen)
