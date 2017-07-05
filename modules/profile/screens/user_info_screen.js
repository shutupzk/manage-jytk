import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import PropTypes from 'prop-types'
import localforage from 'localforage'
import { queryUser, queryPatients, updateUser, updatePatient, selectPatient } from '../../../ducks'
import { isEmptyObject, phone, certificateNo, getSex, ages } from '../../../utils'
import {theme, Loading, ErrCard} from 'components'

function getSelfPatient (patients) {
  for (let key in patients) {
    if (patients[key].relationship === '01') {
      return patients[key]
    }
  }
}

// 用户详细信息
class UserInfoScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEdit: false
    }
  }

  componentWillMount () {
    this.getCurrentUser()
  }

  async getCurrentUser () {
    let userId = await localforage.getItem('userId')
    await this.props.queryUser(this.props.client, { userId: userId })
    if (isEmptyObject(this.props.patients)) {
      await this.props.queryPatients(this.props.client, { userId })
    }
  }
  updateInfo () {
    // this.props.updatePatient(this.props.client, {})
    this.props.updateUser(this.props.client, {})
    this.setState({isEdit: false})
  }
  render () {
    if (this.props.error) {
      return <div className=''><ErrCard /></div>
    }
    if (this.props.loading) {
      return <div className=''><Loading showLoading={true} /></div>
    }
    const patient = getSelfPatient(this.props.patients)
    // let btnText = '编辑信息'
    // if (this.state.isEdit) {
    //   btnText = '保存信息'
    // }
    return (
      <div className=''>
        {detailList(this.props.user, patient, this.props, this.state)}
        {/*<button className='fullWidthFixed fullWidthBtn fullWidthBtnMain'
          onClick={() => {
            if (this.state.isEdit) {
              this.updateInfo()
            } else {
              this.setState({isEdit: true})
            }
          }}
        >{btnText}</button>*/}
        <style jsx global>{`
          .list {
            border-top: 0px;
            margin-top: 10px;
            margin-bottom: 5px;
            border-bottom: 0px;
          }
          .item {
            padding: 10px 10px;
            display: flex;
            align-items: center;
            flexDirection: row;
            background-color: #ffffff;
            justifyContent: space-between;
            margin-bottom: 1px;
          }
          .itemLast {
            padding: 10px 10px;
            display: flex;
            align-items: center;
            flexDirection: row;
            background-color: #ffffff;
            justifyContent: space-between;
          }
          .textLeft {
            flex: 1;
            font-size: ${theme.fontsize};
            color: ${theme.fontcolor};
            margin-left: ${theme.tbmargin};
            float: left;
          }
          .textRight {
            flex: 1;
            text-align: right;
            font-size: ${theme.fontsize};
            color: ${theme.mainfontcolor};
            margin-right: ${theme.tbmargin};
          }
          .textRight input{
            border: none;
            line-height: 40px;
            padding: 0;
            margin: 0;
          }
        `}</style>
      </div>
    )
  }
}

const detailList = (user, patient, props, state) => {
  const array = [
    { key: '姓名', value: user.name, defaultValue: user.name },
    // { key: '证件类型', value: '身份证' },
    { key: '身份证号', value: certificateNo(user.certificateNo), defaultValue: user.certificateNo },
    { key: '性别', value: getSex(user.certificateNo) === '0' ? '女' : '男', defaultValue: getSex(user.certificateNo) === '0' ? '女' : '男' },
    { key: '年龄', value: ages(user.birthday), defaultValue: ages(user.birthday) },
    { key: '手机号', value: phone(user.phone), defaultValue: user.phone },
    // { key: '就诊卡号', value: patient.carteVital, defaultValue: patient.carteVital }
  ]
  const length = array.length
  return (
    <div className='list'>
      {!state.isEdit
        ? array.map((item, i) => (
           ListItem(item.key, item.value, i, length, props)
        ))
        : array.map((item, i) => (
           editItem(item.key, item.defaultValue, i, length, props)
        ))
      }
    </div>
  )
}
// 跳转
const gotoBindCard = (props) => {
  const patient = getSelfPatient(props.patients)
  props.selectPatient({patientId: patient.id})
  Router.push({
    pathname: '/profile/bind_card',
    query: {patientId: patient.id}
  })
  // props.navigation.navigate('bind_card')
}

const ListItem = (key, value, i, length, props) => {
  let style = 'item'
  /*if (i === length - 1) {
    style = 'itemLast'
    return (
      <div className={style} key={key}>
        <div className='textLeft'>{key}</div>
        <div className='textRight'>{value}<a onClick={() => gotoBindCard(props)}><span>{value ? '更换' : '添加'}</span></a></div>
      </div>
    )
  }*/
  return (
    <div className={style} key={key}>
      <div className={'textLeft'}>{key}</div>
      <div className={'textRight'}>{value}</div>
    </div>
  )
}


const editItem = (key, value, i, length, props) => {
  /*if (i === length - 1) {
    return (
      <div style={{backgroundColor: '#fff', marginBottom: 1, display: 'flex'}} key={key}>
        <div className='textLeft' style={{padding: 10}}>{key}</div>
        <div className='textRight' style={{padding: 10}}>{value}<a onClick={() => gotoBindCard(props)}><span>{value ? '更换' : '添加'}</span></a></div>
      </div>
    )
  }*/
  return (
    <div style={{backgroundColor: '#fff', marginBottom: 1, display: 'flex'}} key={key}>
      <div className={'textLeft'} style={{padding: 10}}>{key}</div>
      {
        key === '年龄' || key === '性别'
        ? <div className={'textRight'}><input defaultValue={value} className='textRight' disabled /></div>
        : <div className={'textRight'}><input defaultValue={value} className='textRight' /></div>
      }
    </div>
  )
}

UserInfoScreen.propTypes = {
  user: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    user: state.user.data,
    patients: state.patients.data,
    error: state.user.error || state.patients.error,
    loading: state.user.loading || state.patients.loading
  }
}

export default connect(
  mapStateToProps, { queryUser, queryPatients, updateUser, updatePatient, selectPatient }
)(UserInfoScreen)
