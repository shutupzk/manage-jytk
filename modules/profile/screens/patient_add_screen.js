import React, { Component } from 'react'
import _ from 'lodash'
// import Router from 'next/router'
import localforage from 'localforage'
// import swal from 'sweetalert2'
import { Prompt, theme } from 'components'
import { ages, getBirthday, getSex, checkPhoneNumber, checkIdCard } from '../../../utils'
import { addPatient, queryPatients, updatePatientDefault } from '../../../ducks'
import { connect } from 'react-redux'
import {HOSPITAL_NAME} from 'config'

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
  }
  changeCheckbox (e) {
    this.setState({default: e.target.checked})
  }
  async addPatientSubmit () {
    const userId = this.props.userId || await localforage.getItem('userId')
    const name = this.state.name
    const phone = this.state.phone
    const certificateNo = this.state.certificateNo
    const relationship = this.state.relationship
    console.log('-----relationship', relationship)
    const carteVital = this.state.carteVital
    const isDefault = this.state.default
    if (!name) {
      this.setState({
        isShow: true,
        promptContent: '姓名不能为空'
      })
      return console.log('', '')
    }
    if (!certificateNo) {
      this.setState({
        isShow: true,
        promptContent: '身份证不能为空'
      })
      return
    }
    if (!checkIdCard(certificateNo.toUpperCase())) {
      this.setState({
        isShow: true,
        promptContent: '身份证格式不正确'
      })
      return
    }
    if (!phone) {
      this.setState({
        isShow: true,
        promptContent: '手机号不能为空'
      })
      return
    }
    if (!checkPhoneNumber(phone)) {
      this.setState({
        isShow: true,
        promptContent: '手机号格式不正确'
      })
      return
    }
    this.setState({animating: true})
    const error = await this.props.addPatient(this.props.client, { userId, name, phone, certificateNo: certificateNo.toUpperCase(), relationship, carteVital, isDefault })
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
      return
    }
    return window.history.back()// Router.push('/profile/patient_list')
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
          <div className='item flex tb-flex' key={'name'}>
            <span className='textLeft'>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
            <input placeholder={'输入您的真实姓名'} className='textInput itemViewRight'
              onChange={(e) => this.setState({ name: e.target.value, isShow: false })} />
          </div>
          <div className='item flex tb-flex' key={'certificateNo'}>
            <span className='textLeft'>身份证号</span>
            <input placeholder={'输入身份证号'} className='textInput itemViewRight'
              onChange={(e) => {
                var certificateNo = e.target.value
                if (certificateNo.length === 18) {
                  const birthday = getBirthday(certificateNo)
                  const sex = getSex(certificateNo)
                  const sexText = sex === '0' ? '女' : '男'
                  const age = ages(birthday) + ''
                  const ageText = age + '岁'
                  this.setState({ certificateNo, birthday, age, ageText, sex, sexText, isShow: false })
                } else {
                  this.setState({ certificateNo, isShow: false })
                }
              }} />
          </div>
          <div className='item flex tb-flex' key={'sex'}>
            <span className='textLeft'>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>
            <input placeholder={this.state.sexText} className='textInput itemViewRight' disabled />
          </div>
          <div className='item flex tb-flex' key={'birthday'}>
            <span className='textLeft'>出生日期</span>
            <input placeholder={this.state.birthday} className='textInput itemViewRight' disabled />
          </div>
          <div className='item flex tb-flex' key={'phone'}>
            <span className='textLeft'>手&nbsp;&nbsp;机&nbsp;号</span>
            <input placeholder={'输入手机号'} className='textInput itemViewRight'
              onChange={(e) => this.setState({ phone: e.target.value, isShow: false })} />
          </div>
          {
            HOSPITAL_NAME.indexOf('鲁中') > -1 ?
              <div
                key={'relationship'}
                className='item flex tb-flex'>
                <span className='textLeft'>选择关系</span>
                <div className={'select'} style={{flex: 8, border: 'none', padding: 0}}>
                  <select style={{fontSize: theme.fontsize, color: theme.fontcolor}}
                    onChange={(e) => {
                      this.setState({ relationship: e.target.value })
                      {/* this.popupDialog.dismiss() */}
                    }}>
                  {
                    relations.map((item, i) => (
                      <option key={item.key} value={item.key}>{item.value}</option>
                    ))
                  }
                  </select>
                </div>
              </div>
            : ''
          }
          {/* {
            HOSPITAL_NAME.indexOf('鲁中') > -1 ?
              <div className={'item'} key={'relationship'}>
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
              </div>
            : ''
          } */}
          {/*<div className='item flex tb-flex' key={'carteVital'}>
            <span className='textLeft'> 医保卡号 </span>
            <input placeholder={'非医保卡号可不填写'} className='textInput itemViewRight'
              onChange={(e) => this.setState({ carteVital: e.target.value })} />
          </div>*/}
          <div style={{marginTop: 20}}>
            <div className='item flex tb-flex'>
              <span className='textLeft'>设为默认就诊人</span>
              <input type='checkbox' style={{float: 'right', zoom: '160%', marginRight: 12}} onClick={(e) => { this.changeCheckbox(e) }} />
            </div>
          </div>
        </div>
        <div style={{margin: '20px'}}><button className='btnBG btnBGMain' style={{display: 'block', width: '100%', color: '#fff'}} onClick={() => { this.addPatientSubmit() }} >完 成</button></div>
        <div style={{padding: 25}}>
          *如已在医院建档，请填写该就诊人在医院预留的手机号
        </div>
        <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
        <style jsx>{`
          .list {
            margin: ${theme.tbmargin} 0;
          }
          .dialogList {
            marginTop: 0px;
          }
          .item {
            height: .46rem;
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
            font-size: ${theme.fontsize};
            color: ${theme.fontcolor};
            margin-left: .15rem;
          }
          .itemViewRight {
            width: 58%;
            flex: 8;
            border: 0px;
            float: right;
            font-size: ${theme.fontsize};
            color: ${theme.mainfontcolor};
            margin-right: .15rem;
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
