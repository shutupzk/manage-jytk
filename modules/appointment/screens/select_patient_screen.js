import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'

import PatientList from '../../profile/components/patient_list'
import { queryPatients, selectPatient } from '../../../ducks'

class SelectPatientScreen extends Component {
  gotoDetail (patientId) {
    const { selectPatient } = this.props
    selectPatient({patientId})
    window.history.back()
    // this.props.url.back()
  }
  render () {
    return (
      <div className='container'>
        <PatientList patients={this.props.patients} gotoDetail={(patientId) => { this.gotoDetail(patientId) }} />
        <button className='blockPrimaryBtn' style={{width: '90%', display: 'block', bottom: 20, position: 'absolute'}} onClick={() => Router.push('/profile/patient_add')}>
          <span>添加</span>
        </button>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    patients: state.patients.data,
    patientId: state.patients.selectId,
    loading: state.patients.loading,
    error: state.patients.error
  }
}

export default connect(mapStateToProps, { queryPatients, selectPatient })(SelectPatientScreen)
