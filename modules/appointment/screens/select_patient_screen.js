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
        <button className='fullWidthBtn fullWidthFixed fullWidthBtnMain' onClick={() => Router.push('/profile/patient_add')}>
          添加
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
