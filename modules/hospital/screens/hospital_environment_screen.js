import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  queryHospitals,
  selectHospital
} from '../../../ducks'
import { isEmptyObject } from '../../../utils'

class HospitalEnvironmentScreen extends Component {
  componentWillMount () {
    const hospitals = this.props.hospitals
    if (isEmptyObject(hospitals)) {
      this.props.queryHospitals(this.props.client)
    }
  }
  getHospital (hospitals) {
    let hosiptal = {}
    for (let item in hospitals) {
      hosiptal = hospitals[item]
      break
    }
    return hosiptal
  }
  render () {
    if (this.props.loading) {
      return (
        <div>loading...</div>
      )
    }
    if (this.props.error) {
      return (
        <div>error...</div>
      )
    }
    const hospital = this.getHospital(this.props.hospitals)
    const imgUrl = hospital.image || '/static/icons/hospital_bg_image.png'
    return (
      <div>
        <div style={{margin: 20, backgroundColor: '#ffffff'}}>
          <div style={{textAlign: 'center'}}>医院外观</div>
          <img src={imgUrl} style={{width: '100%', height: 'auto'}} />
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    hospitals: state.hospitals.data,
    loading: state.hospitals.loading,
    error: state.hospitals.error
  }
}
export default connect(mapStateToProps, {queryHospitals, selectHospital})(HospitalEnvironmentScreen)
