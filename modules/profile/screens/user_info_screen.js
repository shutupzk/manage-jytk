import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import PropTypes from 'prop-types'
import localforage from 'localforage'
import { queryUser, queryPatients, selectPatient } from '../../../ducks'
import { isEmptyObject, phone, certificateNo, getSex, ages } from '../../../utils'

function getSelfPatient (patients) {
  for (let key in patients) {
    if (patients[key].relationship === '01') {
      return patients[key]
    }
  }
}

// 用户详细信息
class UserInfoScreen extends Component {
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
  render () {
    if (this.props.error) {
      return <div className='container'>error...</div>
    }
    if (this.props.loading) {
      return <div className='container'>loading...</div>
    }
    const patient = getSelfPatient(this.props.patients)
    return (
      <div className='container'>
        {detailList(this.props.user, patient, this.props)}
        <style jsx global>{`
          .list {
            border-top: 0px;
            margin-top: 10px;
            margin-bottom: 5px;
            border-bottom: 0px;
          }
          .item {
            padding: 10px 20px;
            display: flex;
            align-items: center;
            flexDirection: row;
            background-color: #ffffff;
            justifyContent: space-between;
            margin-bottom: 1px;
          }
          .itemLast {
            padding: 10px 20px;
            display: flex;
            align-items: center;
            flexDirection: row;
            background-color: #ffffff;
            justifyContent: space-between;
          }
          .textLeft {
            flex: 1;
            font-size: 16px;
            color: #505050;
            margin-left: 10px;
            float: left;
          }
          .textRight {
            flex: 1;
            text-align: right;
            font-size: 14px;
            color: #797979;
            margin-right: 10px;
          }
        `}</style>
      </div>
    )
  }
}

const detailList = (user, patient, props) => {
  const array = [
    { key: '姓名', value: user.name },
    // { key: '证件类型', value: '身份证' },
    { key: '证件号', value: certificateNo(user.certificateNo) },
    { key: '性别', value: getSex(user.certificateNo) === '0' ? '女' : '男' },
    { key: '年龄', value: ages(user.birthday) },
    { key: '手机号', value: phone(user.phone) },
    { key: '就诊卡号', value: patient.carteVital }
  ]
  const length = array.length
  return (
    <div className='list'>
      {
        array.map((item, i) => (
           ListItem(item.key, item.value, i, length, props)
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
  if (i === length - 1) {
    style = 'itemLast'
    return (
      <div className={style} key={key}>
        <div className='textLeft'>{key}</div>
        <div className='textRight'>{value}<a onClick={() => gotoBindCard(props)}><span>{value ? '更换' : '添加'}</span></a></div>
      </div>
    )
  }
  return (
    <div className={style} key={key}>
      <div className={'textLeft'}>{key}</div>
      <div className={'textRight'}>{value}</div>
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
  mapStateToProps, { queryUser, queryPatients, selectPatient }
)(UserInfoScreen)
