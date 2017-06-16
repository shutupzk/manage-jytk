import React, { Component } from 'react'
import Router from 'next/router'
// import swal from 'sweetalert2'

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
      return console.log('', '姓名不能为空')
    }
    if (!certificateNo) {
      return console.log('', '身份证号不能为空')
    }
    if (certificateNo.length !== 18) {
      return console.log('', '身份证格式不正确')
    }
    this.setState({animating: true})
    const error = await this.props.signup(this.props.client, { phone, password, certificateNo, name })
    this.setState({animating: false})
    if (error) {
      return console.log('', error + '')
    }
    Router.push('/signin')
  }
  render () {
    return (<div>
      <div className={'list'}>
        <div className={'item'} key={'name'}>
          <span className={'textLeft'}> &nbsp;姓 名 </span>
          <input placeholder={'输入您的真实姓名'} className='textInput' style={{width: '60%'}}
            onChange={(e) => this.setState({ name: e.target.value })} />
        </div>
        <div className={'item'} key={'certificateNo'}>
          <span className={'textLeft'}>{'身份证号'}</span>
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
        <div className={'item'} key={'sex'}>
          <span className={'textLeft'}> &nbsp;性 别 </span>
          <input placeholder={'输入身份证号后自动生成'} className='textInput' style={{width: '60%'}} value={this.state.sexText}
            disabled
            />
        </div>
        <div className={'item'} key={'birthday'}>
          <span className={'textLeft'}>{'出生日期'}</span>
          <input placeholder={'输入身份证号后自动生成'} className='textInput' style={{width: '60%'}} value={this.state.birthday}
            disabled
            />
        </div>
        <div className={'item'} key={'carteVital'}>
          <span className={'textLeft'}>{'医保卡号'}</span>
          <input placeholder={'非医保用户可不填'} className='textInput' style={{width: '60%'}}
            onChange={(e) => this.setState({ carteVital: e.target.value })} />
        </div>
      </div>
      <button
        className='blockPrimaryBtn' style={{width: '92%', display: 'block', margin: '4%'}}
        title='完成'
        onClick={() => this.submit()}
        >完成</button>
      {/* <Popup ref={popup => { this.popup = popup }} /> */}
      <style jsx>{`
        .container {
          flex: 1;
          margin-left: 5%;
          margin-top: 20px;
        }
        .list {
          {/*margin-top: 10px;*/}
          margin-bottom: 15px;
        }
        .item {
          height: 51px;
          flex-wrap: nowrap;
          align-items: center;
          flex-direction: row;
          background-color: #ffffff;
          justify-content: space-between;
          border-bottom: solid 1px #E6E6E6;
        }
        .textLeft {
          flex: 1;
          font-size: 16px;
          color: #505050;
          margin-left: 15px;
        }
        .TextInput {
          flex: 3;
          margin-right: 15px;
        },
        .buttonStyle: {
          margin-top: 35px;
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

export default connect(mapStateToProps, { signup })(SignupCompletionScreen)
