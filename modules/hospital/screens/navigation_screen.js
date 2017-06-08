import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'

import {
  queryHospitals,
  selectHospital
} from '../../../ducks'
import { isEmptyObject } from '../../../utils'

class NavigationScreen extends Component {
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
    return (
      <div>
        <div style={{marginBottom: 10, backgroundColor: '#ffffff', padding: 15}}>
          <div style={{borderLeft: 'solid 3px #3CA0FF', paddingLeft: 10, borderBottom: 'solid 1px #eeeeee'}}>医院地址</div>
          {hospital.address}
        </div>
        <div style={{marginBottom: 10, backgroundColor: '#ffffff', padding: 15}}>
          <div style={{borderLeft: 'solid 3px #3CA0FF', paddingLeft: 10, borderBottom: 'solid 1px #eeeeee'}}>周边交通</div>
          <div style={{marginBottom: 10}}>公交
            <div style={{color: '#505050'}}>xx路</div>
          </div>
          <div style={{marginBottom: 10}}>地铁
            <div style={{color: '#505050'}}>xx号线</div>
          </div>
        </div>
        <div style={{margin: 15}}>
          <button
            onClick={() => { Router.push('/hospital/navigation/maps') }}
            style={{width: '100%', display: 'block', backgroundColor: '#3CA0FF', height: '40px', borderRadius: '20px', fontSize: 16}}
          >查看地图</button>
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
export default connect(mapStateToProps, {queryHospitals, selectHospital})(NavigationScreen)
