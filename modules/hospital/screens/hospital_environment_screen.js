import React, { Component } from 'react'
import { connect } from 'react-redux'
import {ErrCard, theme, Loading} from 'components'

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
        <div><Loading showLoading={true} /></div>
      )
    }
    if (this.props.error) {
      return (
        <div><ErrCard /></div>
      )
    }
    const hospital = this.getHospital(this.props.hospitals)
    const imgUrl = hospital.image || '/static/icons/hospital_bg_image.png'
    return (
      <div>
        <div>
          <div className='flex tb-flex' style={{padding: '15px 30px', marginTop: theme.tbmargin, justifyContent: 'space-between'}}>
            <p style={{height: 1, background: theme.bordercolor, width: '30%'}}></p>
            <span style={{width: '25%', color: theme.mainfontcolor, textAlign: 'center'}}>医院外观</span>
            <p style={{height: 1, background: theme.bordercolor, width: '30%'}}></p>
          </div>
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
