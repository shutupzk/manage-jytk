import React, { Component } from 'react'
import _ from 'lodash'
// import Router from 'next/router'
import localforage from 'localforage'
// import swal from 'sweetalert2'
import { Prompt } from 'components'
import { ages, getBirthday, getSex } from '../../../utils'
import { addPatient, queryPatients, updatePatientDefault } from '../../../ducks'
import { connect } from 'react-redux'

class PatientAddScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      status: false,
      relationship: '02',
      relationshipText: '请选择您与就诊人的关系',
      birthday: '出生日期',
      sexText: '性别',
      default: false,
      animating: false,
      autoClose: true,
      closeTime: 2,
      isShow: false,
      promptContent: ''
    }
    this.addPatient = this.addPatient.bind(this)
  }
  changeCheckbox (e) {
    this.setState({default: e.target.checked})
  }
  async addPatient () {
    let i = 2
    const userId = this.props.userId || await localforage.getItem('userId')
    const name = this.state.name
    const phone = this.state.phone
    const certificateNo = this.state.certificateNo
    const relationship = this.state.relationship
    const carteVital = this.state.carteVital
    const isDefault = this.state.default
    if (!name) {
      this.setState({
        isShow: true,
        promptContent: '姓名不能为空'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return console.log('', '')
    }
    if (!certificateNo) {
      this.setState({
        isShow: true,
        promptContent: '身份证不能为空'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
    }
    if (certificateNo.length !== 18) {
      this.setState({
        isShow: true,
        promptContent: '身份证格式不正确'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
    }
    if (!phone) {
      this.setState({
        isShow: true,
        promptContent: '手机号不能为空'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
    }
    if (phone.length !== 11) {
      this.setState({
        isShow: true,
        promptContent: '手机号格式不正确'
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
    }
    // if (!relationship) {
    //   return console.log('', '关系不能为空')
    // }
    this.setState({animating: true})
    const error = await this.props.addPatient(this.props.client, { userId, name, phone, certificateNo, relationship, carteVital, isDefault })
    // const error2 = await this.props.queryPatients(this.props.client, {userId})
    if (isDefault) {
      const patients = await _.omit(this.props.patients, error.data)
      const patientIds = await _.keys(patients)
      var me = this
      patientIds.map(async (patientId) => {
        const error3 = await me.props.updatePatientDefault(me.props.client, {patientId, isDefault: false})
        if (error3) {
          this.setState({
            isShow: true,
            promptContent: error3
          })
          // this.interval = setInterval(() => {
          //   if (i === 0) {
          //     clearInterval(this.interval)
          //     this.setState({ isShow: false, promptContent: '' })
          //   }
          //   i--
          // }, 1000)
          return console.log(error3)
        }
      })
    }
    this.setState({animating: false})
    if (error.error) {
      this.setState({
        isShow: true,
        promptContent: error.error
      })
      // this.interval = setInterval(() => {
      //   if (i === 0) {
      //     clearInterval(this.interval)
      //     this.setState({ isShow: false, promptContent: '' })
      //   }
      //   i--
      // }, 1000)
      return
    }
    return this.props.url.back()// Router.push('/profile/patient_list')
  }
  render () {
    const relations = [
      { key: '01', value: '本人' },
      { key: '02', value: '家庭成员' },
      { key: '03', value: '亲戚' },
      { key: '04', value: '朋友' },
      { key: '05', value: '其他' }
    ]
    return (
      <div>
        <div className='list'>
          <div className='item' key={'name'}>
            <span className='textLeft'>&nbsp;姓&nbsp; 名&nbsp;</span>
            <input placeholder={'输入您的真实姓名'} className='textInput itemViewRight'
              onChange={(e) => this.setState({ name: e.target.value })} />
          </div>
          <div className='item' key={'certificateNo'}>
            <span className='textLeft'> 身份证号 </span>
            <input placeholder={'输入身份证号'} className='textInput itemViewRight'
              onChange={(e) => {
                var certificateNo = e.target.value
                if (certificateNo.length === 18) {
                  const birthday = getBirthday(certificateNo)
                  const sex = getSex(certificateNo)
                  const sexText = sex === '0' ? '女' : '男'
                  const age = ages(birthday) + ''
                  const ageText = age + '岁'
                  this.setState({ certificateNo, birthday, age, ageText, sex, sexText })
                }
              }} />
          </div>
          <div className='item' key={'sex'}>
            <span className='textLeft'>&nbsp;性&nbsp; 别&nbsp;</span>
            <input placeholder={this.state.sexText} className='textInput itemViewRight' disabled />
          </div>
          <div className='item' key={'birthday'}>
            <span className='textLeft'> 出生日期 </span>
            <input placeholder={this.state.birthday} className='textInput itemViewRight' disabled />
          </div>
          <div className='item' key={'phone'}>
            <span className='textLeft'> 手 机 号 </span>
            <input placeholder={'输入手机号'} className='textInput itemViewRight'
              onChange={(e) => this.setState({ phone: e.target.value })} />
          </div>
          {/* <div className={'item'} key={'relationship'}>
            <span className={'textLeft'}>与本人关系</span>
            <input placeholder={'与本人关系'} className='textInput'
              onChange={(e) => this.setState({ relationshipText: e.tartet.value })} />
            <div className={'itemViewRight'}
              onClick={() => {
                this.popupDialog.show()
              }}>
              <div className={'selectButton'}>
                <span style={{ color: '#B4B4B4', alignSelf: 'center', fontSize: 16, marginRight: 2 }}>{this.state.relationshipText}</span>
                <img src='/static/icons/arrow-down' style={{size: 15}} />
              </div>
            </div>
          </div> */}
          {/*<div className='item' key={'carteVital'}>
            <span className='textLeft'> 医保卡号 </span>
            <input placeholder={'非医保卡号可不填写'} className='textInput itemViewRight'
              onChange={(e) => this.setState({ carteVital: e.target.value })} />
          </div>*/}
          <div style={{marginTop: 20}}>
            <div className='item'>
              <span className='textLeft'>设为默认就诊人</span>
              <input type='checkbox' style={{float: 'right', zoom: '160%', marginRight: 12}} onClick={(e) => this.changeCheckbox(e)} />
            </div>
          </div>
        </div>
        <div style={{margin: '20px'}}><button className='blockPrimaryBtn' style={{display: 'block', width: '100%'}} onClick={() => this.addPatient()} >完成</button></div>
        {/* <div
          ref={(popupDialog) => { this.popupDialog = popupDialog }}>
          <div>
            <div id='title'>选择关系</div>
            <div style={'dialogList'} >
              {
                relations.map((item, i) => (
                  <div key={item.key}
                    onClick={() => {
                      this.setState({ relationship: item.key, relationshipText: item.value })
                      this.popupDialog.dismiss()
                    }}>
                    <div className={'selectItem'}>
                      <div className={'itemText'} >{item.value}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div> */}
        <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
        <style jsx>{`
          .list {
            margin-top: 20px;
            margin-bottom: 5px;
          }
          .dialogList {
            marginTop: 0px;
          }
          .item {
            display: flex;
            height: 51px;
            flex-wrap: nowrap;
            align-items: center;
            flex-direction: row;
            background-color: #ffffff;
            margin-bottom: 1px;
          }
          .itemLast {
            height: 51px;
            align-items: center;
            flex-direction: row;
            background-color: #ffffff;
            justifyContent: space-between;
          }
          .textLeft {
            flex: 3;
            fontSize: 16px;
            color: #797979;
            margin-left: 20px;
          }
          .itemViewRight {
            width: 58%;
            flex: 8;
            border: 0px;
            float: right;
            margin-right: 20px;
          }
          .selectButton {
            height: 51px;
            margin-right: 10px;
            flex-wrap: nowrap;
            flex-direction: row;
          }
          .selectItem {
            height: 51,
            align-items: center;
            justify-content: center;
            border-bottom-color: #D8D8D8;
            border-bottom-width: 1px;
          }
          .itemText {
            color: #505050;
            font-size: 18px;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    patients: state.patients.data,
    userId: state.user.data.id,
    loading: state.patients.loading || state.patients.loading,
    error: state.patients.error || state.patients.error
  }
}


export default connect(mapStateToProps, {addPatient, queryPatients, updatePatientDefault})(PatientAddScreen)
