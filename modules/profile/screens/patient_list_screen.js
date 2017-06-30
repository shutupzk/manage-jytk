import React, {Component } from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'
import localforage from 'localforage'

import { queryPatients, selectPatient } from '../../../ducks'
// import { ages } from '../../../utils'
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
    // var height = process.browser ? window.innerHeight - 100 : ''
    return (
      <div>
        <div>
          <PatientList patients={this.props.patients} gotoDetail={(patientId) => { this.gotoDetail(patientId) }} />
        </div>
        <button
          className='fullWidthFixed fullWidthBtn fullWidthBtnMain'
          onClick={() => Router.push('/profile/patient_add')}>添加就诊人</button>
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
