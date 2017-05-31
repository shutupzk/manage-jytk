import React, {Component } from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'
import localforage from 'localforage'

import { queryPatients, selectPatient } from '../../../ducks'
import { ages } from '../../../utils'
import PatientList from '../components/patient_list'

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

  gotoDetail (patientId) {
    const { selectPatient } = this.props
    selectPatient({patientId})
    Router.push('/profile/patient_detail?patientId=' + patientId)
  }
  render () {
    if (this.props.loading) {
      return <div>loading</div>
    }
    if (this.props.error) {
      return <div>error</div>
    }
    return (
      <div className='container'>
        <PatientList patients={this.props.patients} gotoDetail={(patientId) => { this.gotoDetail(patientId) }} />
        <button className='blockPrimaryBtn' style={{width: '90%', display: 'block', bottom: 20, position: 'absolute'}} onClick={() => Router.push('/profile/patient_add')}>
          <span >添加</span>
        </button>
      </div>
    )
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
