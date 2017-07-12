import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import {ErrCard, Loading, theme} from 'components'
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
        <div><Loading showLoading={true} /></div>
      )
    }
    if (this.props.error) {
      return (
        <div><ErrCard /></div>
      )
    }
    const hospital = this.getHospital(this.props.hospitals)
    return (
      <div>
        <div style={{marginBottom: 10, backgroundColor: '#ffffff'}}>
          <div style={{padding: '15px', fontSize: 16, borderBottom: 'solid 1px #eeeeee', borderColor: theme.bordercolor, color: theme.maincolor}}>医院地址</div>
          <div style={{padding: '10px 15px', borderBottom: 'solid 1px #eeeeee', borderColor: theme.bordercolor, color: theme.mainfontcolor}}>{hospital.address}</div>
        </div>
        <div style={{marginBottom: 20, backgroundColor: '#fff', fontSize: 14}}>
          <div style={{padding: '15px', fontSize: 16, borderBottom: 'solid 1px #eeeeee', borderColor: theme.bordercolor, color: theme.maincolor}}>周边交通</div>
          <div style={{padding: '10px 15px 0', color: theme.mainfontcolor}}>公交
            <div style={{color: '#505050'}}>{hospital.bus || '无'}</div>
          </div>
          <div style={{padding: '10px 15px 20px', color: theme.mainfontcolor}}>地铁
            <div style={{color: '#505050'}}>{hospital.subway || '无'}</div>
          </div>
        </div>
        <div style={{margin: 15}}>
          <button
            onClick={() => { Router.push('/hospital/navigation/maps') }}
            className='btnBG btnBGMain'
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
