import React, { Component } from 'react'
import Router from 'next/router'
// import swal from 'sweetalert2'

import { signup } from '../../../ducks'
import { connect } from 'react-redux'
import { getBirthday, getSex } from '../../../utils'
import {theme} from 'components'

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
      <div className='loginPageText'>
        <section className={'flex tb-flex'} key={'name'}>
          <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
          <input placeholder={'输入您的真实姓名'}
            onChange={(e) => this.setState({ name: e.target.value })} />
        </section>
        <section className={'flex tb-flex'} key={'certificateNo'}>
          <span>{'身份证号'}</span>
          <input placeholder={'输入身份证号'}
            onChange={(e) => {
              var certificateNo = e.target.value
              if (certificateNo.length === 18) {
                const birthday = getBirthday(certificateNo)
                const sex = getSex(certificateNo)
                const sexText = sex === '0' ? '女' : '男'
                this.setState({ certificateNo, birthday, sexText })
              }
            }} />
        </section>
        <section className={'flex tb-flex'} key={'sex'}>
          <span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别 </span>
          <input placeholder={'输入身份证号后自动生成'} value={this.state.sexText}
            disabled
            />
        </section>
        <section className={'flex tb-flex'} key={'birthday'}>
          <span>{'出生日期'}</span>
          <input placeholder={'输入身份证号后自动生成'} value={this.state.birthday}
            disabled
            />
        </section>
        <section className={'flex tb-flex'} key={'carteVital'}>
          <span>{'医保卡号'}</span>
          <input placeholder={'非医保用户可不填'}
            onChange={(e) => this.setState({ carteVital: e.target.value })} />
        </section>
      </div>
      <footer style={{margin: '10px 15px'}}>
        <button
          className='btnBG btnBGMain loginPageBtnItem'
          title='完成'
          onClick={() => this.submit()}>完成</button>
      </footer>
      {/* <Popup ref={popup => { this.popup = popup }} /> */}
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
        .loginPageText .towBtn{
          justify-content: space-between;
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
        .loginPage .loginpagelogo{
          width: 50%;
          position: fixed;
          bottom: .5rem;
          left: 25%;
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
