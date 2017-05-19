import React, {Component } from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'
import localforage from 'localforage'

import { queryPatients, selectPatient } from '../../../ducks'
import { ages } from '../../../utils'

class PatientListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: false
    }
  }
  componentWillMount () {
    this.getPatients()
  }

  async getPatients () {
    if (!this.state.query) {
      const userId = await localforage.getItem('userId')
      this.setState({query: true})
      this.props.queryPatients(this.props.client, { userId })
    }
  }
  render () {
    return (
      <div className='container' style={styles.container}>
        {patientList(this.props)}
        <button className='blockPrimaryBtn' style={{width: '90%', display: 'block', bottom: 20, position: 'absolute'}} onClick={() => Router.push('/profile/patient_add')}>
          <span >添加</span>
        </button>
      </div>
    )
  }
}

const gotoDetail = (props, patientId) => {
  const { selectPatient } = props
  selectPatient({patientId})
  Router.push('/profile/patient_detail?patientId=' + patientId)
}

const patientList = (props) => {
  const patients = props.patients
  console.log(patients)
  let array = []
  for (let i in patients) {
    if (patients[i] && patients[i].id) {
      array.push(patients[i])
    }
  }
  return (
    <div style={styles.listView}>
      {array.map((item, i) => (
        Item(props, item, i)
      ))}
    </div>
  )
}

const Item = (props, item, i) => {
  return (
    <div
      style={{marginBottom: '10px'}}
      key={item.id}
      onClick={() => { gotoDetail(props, item.id) }}>
      <div style={styles.itemView} >
        <div style={styles.itemTop}>
          <span style={styles.nameText}>{item.name}</span>
          {ownText(item.relationship)}
          {sexIcon(item)}
          <span style={styles.smallText}>{`${ages(item.birthday)}岁`}</span>
          <span style={{float: 'right'}}>{item.default ? '默认' : ''}</span>
        </div>
        <div style={styles.itemMiddle}>
          {/* <Icon name='address-card-o' type='font-awesome' size={12} /> */}
          <img style={{size: 12}} src='/static/icons/idCard_icon.png' />
          <span style={styles.smallText}>{item.certificateNo}</span>
        </div>
        <div style={styles.itemMiddle}>
          {/* <Icon name='phone' type='simple-line-icon' size={12} /> */}
          <img style={{size: 12}} src='/static/icons/phoneNum_icon.png' />
          <span style={styles.smallText} >{item.phone}</span>
        </div>
      </div>
    </div>
  )
}

const sexIcon = (item) => {
  console.log(item.sex)
  let name = 'venus'
  let color = '#FF7C7C'
  if (item.sex === '0') {
    name = 'mars'
    color = '#3CA0FF'
  }
  return <img style={{size: 15, color: color}} src='/static/icons/sex_male.png' /> // <Icon name={name} type='font-awesome' size={15} color={color} />
}

const ownText = (i) => {
  if (i !== '01') return null
  return <span style={styles.ownText}>{`（本人）`}</span>
}

const styles = {
  container: {
    flex: 1
  },
  listView: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15
  },
  itemView: {
    borderTopWidth: 0,
    backgroundColor: '#eeeeee',
    height: 100,
    // borderBottom: '1px solid #eeeeee',
    padding: '10px 15px'
  },
  itemTop: {
    borderTopWidth: 0,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2
  },
  nameText: {
    fontSize: 18,
    marginRight: 10
  },
  ownText: {
    fontSize: 14,
    color: '#B4B4B4'
  },
  smallText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#797979'
  },
  itemMiddle: {
    marginTop: 9,
    borderTopWidth: 0,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'baseline'
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.data.id,
    patients: state.patients.data,
    loading: state.patients.loading,
    error: state.patients.error
  }
}

export default connect(mapStateToProps, { queryPatients, selectPatient })(PatientListScreen)
