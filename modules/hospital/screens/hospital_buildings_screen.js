import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import {ErrCard, Loading, theme} from 'components'
import {
  queryHospitals,
  selectHospital,
  queryHospitalBuildings,
  selectHospitalBuildings
} from '../../../ducks'
import { isEmptyObject } from '../../../utils'

class IndoorNavigationScreen extends Component {
  componentWillMount () {
    const hospitals = this.props.hospitals
    if (isEmptyObject(this.props.hospitals)) {
      this.hetHospitalWithBuildings()
    } else if (!this.getHospital(hospitals).buildings) {
      this.getBuildings(this.getHospital(hospitals).id)
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
  async hetHospitalWithBuildings () {
    await this.props.queryHospitals(this.props.client)
    const hospitals = this.props.hospitals
    this.props.selectHospital({hospitalId: this.getHospital(hospitals).id})
    this.getBuildings(this.getHospital(hospitals).id)
  }
  getBuildings (hospitalId) {
    this.props.queryHospitalBuildings(this.props.client, {hospitalId})
  }
  render () {
    if (this.props.loading) {
      return (
        <div>
          <div><Loading showLoading={true} /></div>
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <div><ErrCard /></div>
        </div>
      )
    }
    let hosiptal = {}
    for (let item in this.props.hospitals) {
      hosiptal = this.props.hospitals[item]
      break
    }
    let buildings = hosiptal.buildings || []
    return (
      <div>
        <div className={'titleView'}>
          <div className={'circle'} />
          <div className={'contentView'}>
            <span className={'text'}>{hosiptal.hospitalName}</span>
          </div>
          <div className={'rightCircle'} />
        </div>
        {
          buildings.map((item, i) => (
            <div key={i} onClick={() => {
              Router.push('/hospital/floors?buildingId=' + item.id)
              this.props.selectHospitalBuildings({buildingId: item.id})
            }}>
              <div className={'titleView'}>
                <div className={'contentView'}>
                  <span className={'text'}>{item.name}</span>
                </div>
              </div>
            </div>
          ))
        }
        <style jsx>{`
          .titleView {
            height: 50px;
            border-radius: 5px;
            background-color: white;
            margin: 5px;
            flex-direction: row;
            display: flex;
          }
          .circle {
            height: 6px;
            width: 6px;
            border-radius: 3px;
            background-color: #3CA0FF;
            margin: 6px;
          }
          .rightCircle {
            height: 6px;
            width: 6px;
            border-radius: 3px;
            background-color: #3CA0FF;
            margin: 6px;
            float: right;
          }
          .contentView {
            text-align: center;
            flex: 1;
            margin: 10px;
            align-items: center;
            justify-content: center;
          }
          .text {
            text-align: center;
            font-size: 15px;
            color: #505050;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    selectId: state.hospitals.selectId,
    hospitals: state.hospitals.data,
    loading: state.hospitals.loading,
    error: state.hospitals.error
  }
}

export default connect(mapStateToProps, {
  queryHospitals,
  selectHospital,
  queryHospitalBuildings,
  selectHospitalBuildings
})(IndoorNavigationScreen)
