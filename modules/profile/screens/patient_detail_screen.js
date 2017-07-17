import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
import Router from 'next/router'
import _ from 'lodash'
import {HOSPITAL_NAME} from 'config'
// import swal from 'sweetalert2'
import { theme, Prompt, Modal, ModalHeader, ModalFooter } from 'components'
import { ages, isEmptyObject, phone, certificateNo } from '../../../utils'
import { queryUser, queryPatients, removePatient, updatePatient, updatePatientDefault } from '../../../ducks'

class PatientDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: false,
      isEdit: false,
      showModal: false,
      autoClose: true,
      closeTime: 2,
      isShow: false,
      promptContent: ''
    }
  }
  componentWillMount () {
    if (isEmptyObject(this.props.patients)) {
      this.getPatients()
    } else {
      if (isEmptyObject(this.props.user) || !this.props.user.name) {
        this.getUser()
      }
    }
  }

  async getPatients () {
    if (!this.state.query) {
      const userId = await localforage.getItem('userId')
      this.setState({query: true})
      this.props.queryPatients(this.props.client, { userId })
      this.props.queryUser(this.props.client, { userId })
    }
  }
  async getUser () {
    if (!this.state.query) {
      const userId = await localforage.getItem('userId')
      this.setState({query: true})
      this.props.queryUser(this.props.client, { userId })
    }
  }

  updatePatient () {
    this.setState({isEdit: false})
  }

  // 删除就诊人
  beforeDelPatient () {
    const patients = this.props.patients
    const patient = patients[this.props.selectId]
    if (this.props.user.certificateNo === patient.certificateNo) {
      return this.setState({
        isShow: true,
        promptContent: '本人不能删除'
      })
    }
    this.setState({
      showModal: true
    })
  }
  async delPatient () {
    const error = await this.props.removePatient(this.props.client, {patientId: this.props.selectId})
    console.log('----err', error)
    if (error) {
      return this.setState({
        isShow: true,
        promptContent: error
      })
    }
    return window.history.back()
  }
  renderModal () {
    let modalHtml
    modalHtml = <Modal showModalState={this.state.showModal}>
      <ModalHeader classChild='modalheaderTip'>提示</ModalHeader>
      <div style={{padding: 20, color: theme.fontcolor, textAlign: 'center'}}>
        确认删除该患者吗？
      </div>
      <ModalFooter>
        <button className='modalBtn modalBtnBorder' onClick={(e) => { this.setState({showModal: false}) }}>以后再说</button>
        <button className='modalBtn modalMainBtn' onClick={(e) => {
          this.delPatient()
        }}
        >确定</button>
      </ModalFooter>
    </Modal>
    return modalHtml
  }
  render () {
    return (
      <div>
        {this.renderModal()}
        {detailList(this.props, this.bindCard)}
        <div className='fullWidthFixed'>
          <button
            className='fullWidthFixed fullWidthBtn fullWidthBtnBackWhite'
            onClick={() => { this.beforeDelPatient() }}
            >删除就诊人</button>
        </div>
        {/*{this.state.isEdit
        ? <div className='fullWidthFixed'>
          <button
            className='fullWidthFixed fullWidthBtn fullWidthBtnMain'
            onClick={() => { this.updatePatient(this.props) }}
            >保存就诊人</button>
        </div>
        : <div className='fullWidthFixed'>
          <button
            className='fullWidthBtn fullWidthBtnBackWhite'
            style={{width: '50%'}}
            onClick={() => { this.delPatient(this.props) }}
            >删除就诊人</button>
          <button
            className='fullWidthBtn fullWidthBtnMain'
            style={{width: '50%'}}
            onClick={() => { this.setState({isEdit: true}) }}
            >编辑就诊人</button>
        </div>}*/}
        <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
        <style jsx global>{`
          .list {
            border-top: 0px;
            margin-top: 10px;
            margin-bottom: 5px;
            border-bottom: 0px;
          }
          .item {
            padding: 10px 20px;
            {/*height: 31px;*/}
            {/*flexWrap: nowrap;*/}
            align-items: center;
            flexDirection: row;
            background-color: #ffffff;
            justifyContent: space-between;
            margin-bottom: 1px;
          }
          .textLeft {
            font-size: 16px;
            color: #797979;
            {/*margin-left: 20px;*/}
          }
          .textRight {
            float: right;
            font-size: 14px;
            color: #505050;
            {/*margin-right: 20px;*/}
          }
        `}</style>
      </div>
    )
  }
}

async function changeCheckbox (props, e) {
  var patientId = props.url.query.patientId
  if (e.target.checked) {
    const error = await props.updatePatientDefault(props.client, {patientId, isDefault: true})
    if (error) return console.log(error)
    const patients = await _.omit(props.patients, patientId)
    const patientIds = await _.keys(patients)
    patientIds.map(async (patientId) => {
      const error3 = await props.updatePatientDefault(props.client, {patientId, isDefault: false})
      if (error3) return console.log('', error3)
    })
  } else {
    const error = await props.updatePatientDefault(props.client, {patientId, isDefault: false})
    if (error) return console.log(error)
  }
}

const relations = {
  '01': '本人',
  '02': '家庭成员',
  '03': '亲戚',
  '04': '朋友',
  '05': '其他'
}

const detailList = (props) => {
  console.log('----this.props', props.patients)
  const patients = props.patients
  const selectId = props.selectId || props.url.query.patientId
  if (!selectId) {
    return
  }
  const patient = patients[selectId] || {}
  let relationship = relations[patient.relationship || '01'] || '其他'
  let array = [
    { key: '姓名', value: patient.name },
    { key: '身份证号', value: patient.certificateNo ? certificateNo(patient.certificateNo) : '' },
    { key: '性别', value: patient.sex ? patient.sex === '0' ? '女' : '男' : '' },
    { key: '年龄', value: patient.birthday ? `${ages(patient.birthday)}岁` : '' },
    // { key: '出生日期', value: patient.birthday },
    // { key: '与本人关系', value: relationship },
    // { key: '医保卡号', value: patient.carteVital },
    { key: '手机号', value: patient.phone ? phone(patient.phone) : '' },
  ]
  if (HOSPITAL_NAME.indexOf('鲁中') > -1) {
    array.push(
      { key: '与本人关系', value: relationship }, 
      { key: '就诊卡号', value: patient.patientCards && patient.patientCards[0] && patient.patientCards[0].patientIdNo }
    )
  }
  return (
    <div className='list'>
      {
        array.map((item, i) => (
           ListItem(item.key, item.value, props)
        ))
      }
      <div style={{marginTop: 20}}>
        <div className='item'>
          <span className='textLeft'>设为默认就诊人</span>
          <input type='checkbox' style={{float: 'right', zoom: '160%', marginRight: 12}} onClick={(e) => changeCheckbox(props, e)} defaultChecked={patient.default} />
        </div>
      </div>
    </div>
  )
}

// 跳转
const gotoBindCard = (props) => {
  // Router.push('/profile/bind_card')
  Router.push({
    pathname: '/profile/bind_card',
    query: props.url.query
  })
  // props.navigation.navigate('bind_card')
}

const ListItem = (key, value, props) => {
  let rightView = (<div className='textRight'>{value}</div>)
  if (key === '医保卡号') {
    rightView = (
      <div className='textRight'>
        {value}
        <span
          style={{marginLeft: 10}}
          onClick={() => gotoBindCard(props)}
        >
          <a>{value ? '更换' : '绑定'}</a>
        </span>
      </div>
      )
  }
  return (
    <div className='item' key={key}>
      <span className='textLeft'>{key}</span>
      {rightView}
    </div>
  )
}

function mapStateToProps (state) {
  return {
    patients: state.patients.data,
    selectId: state.patients.selectId,
    user: state.user.data,
    loading: state.patients.loading || state.user.loading
  }
}

export default connect(mapStateToProps, { queryUser, queryPatients, removePatient, updatePatient, updatePatientDefault })(PatientDetailScreen)
