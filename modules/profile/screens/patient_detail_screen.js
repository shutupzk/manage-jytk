import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
import Router from 'next/router'
import _ from 'lodash'

import { ages, isEmptyObject } from '../../../utils'
import { queryPatients, removePatient, updatePatient, updatePatientDefault } from '../../../ducks'

class PatientDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.delPatient = this.delPatient.bind(this)
  }
  componentWillMount () {
    if (isEmptyObject(this.props.patients)) {
      this.getPatients()
    }
  }

  async getPatients () {
    if (!this.state.query) {
      const userId = await localforage.getItem('userId')
      this.setState({query: true})
      this.props.queryPatients(this.props.client, { userId })
    }
  }
  // 删除就诊人
  async delPatient () {
    const patients = this.props.patients
    const patient = patients[this.props.selectId]
    if (this.props.user.certificateNo === patient.certificateNo) {
      return console.log('本人不能删除') // this.popup.alert('本人不能删除')
    }
    this.popup.confirm({
      content: '确定删除？',
      ok: {
        text: '确定',
        style: { color: 'red' },
        callback: async () => {
          const error = await this.props.removePatient(this.props.client, {patientId: this.props.selectId})
          console.log('error', error)
          if (error) return this.popup.alert(error)
          return this.props.navigation.goBack(null)
        }
      },
      cancel: {text: '取消', style: {color: 'blue'}}
    })
  }

  render () {
    return (
      <div className='container' style={styles.container}>
        {detailList(this.props, this.bindCard)}
        <button
          className='blockPrimaryBtn'
          style={{backgroundColor: '#FFFFFF', color: '#E45252', display: 'block', width: '100%'}}
          onClick={() => this.delPatient(this.props)}
          >删除就诊人</button>
        {/* <Popup ref={popup => { this.popup = popup }} /> */}
      </div>
    )
  }
}

async function changeCheckbox (props, e) {
  console.log(e.target.checked)
  var patientId = props.url.query.patientId
  if (e.target.checked) {
    const error = await props.updatePatientDefault(props.client, {patientId, isDefault: true})
    if (error) return console.log(error)
    const patients = await _.omit(props.patients, patientId)
    const patientIds = await _.keys(patients)
    patientIds.map(async (patientId) => {
      const error3 = await props.updatePatientDefault(props.client, {patientId, isDefault: false})
      if (error3) return this.popup.alert(error3)
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
  const patients = props.patients
  console.log('patients', patients)
  const selectId = props.selectId || props.url.query.patientId
  console.log('selectId', selectId)
  if (!selectId) {
    return
  }
  const patient = patients[selectId] || {}
  let relationship = relations[patient.relationship || '01'] || '其他'
  const array = [
    { key: '姓名', value: patient.name },
    { key: '性别', value: patient.sex === '0' ? '女' : '男' },
    { key: '年龄', value: `${ages(patient.birthday)}岁` },
    { key: '出生日期', value: patient.birthday },
    { key: '身份证号', value: patient.certificateNo },
    { key: '手机号', value: patient.phone },
    { key: '与本人关系', value: relationship },
    { key: '就诊号', value: patient.patientCards[0].patientIdNo },
    { key: '医保卡号', value: patient.carteVital }
  ]
  return (
    <div style={styles.list}>
      {
        array.map((item, i) => (
           ListItem(item.key, item.value, props)
        ))
      }
      <div style={{marginTop: 20}}>
        <div style={styles.item}>
          <span style={styles.textLeft}>设为默认就诊人</span>
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
  let style = styles.item
  let rightView = (<div style={styles.textRight}>{value}</div>)
  if (key === '医保卡号') {
    rightView = (
      <div style={styles.textRight}>
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
    <div style={style} key={key}>
      <span style={styles.textLeft}>{key}</span>
      {rightView}
    </div>
  )
}

const styles = {
  container: {
  },
  list: {
    borderTopWidth: 0,
    marginTop: 0,
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
  itemLast: {
    height: 51,
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between'
  },
  textLeft: {
    fontSize: 16,
    color: '#797979',
    marginLeft: 10
  },
  textRight: {
    float: 'right',
    fontSize: 14,
    color: '#505050',
    marginRight: 10
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
}

function mapStateToProps (state) {
  console.log('state:', state)
  return {
    patients: state.patients.data,
    selectId: state.patients.selectId,
    user: state.user.data,
    loading: state.patients.loading
  }
}

export default connect(mapStateToProps, { queryPatients, removePatient, updatePatient, updatePatientDefault })(PatientDetailScreen)
