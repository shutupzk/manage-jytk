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
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className={'circle'} />
            <div className={'rightCircle'} />
          </div>
          <div className={'contentView'} style={{fontWeight: '500'}}>
            {hosiptal.hospitalName}
          </div>
        </div>
        {
          buildings.map((item, i) => (
            <div key={i} onClick={() => {
              Router.push('/hospital/floors?buildingId=' + item.id)
              this.props.selectHospitalBuildings({buildingId: item.id})
            }}>
              <div className={'titleView'}>
                <div className={'contentView'} style={{padding: '17px 0', fontSize: 17}}>
                  {item.name}
                </div>
              </div>
            </div>
          ))
        }
        <style jsx>{`
          .titleView {
            border-radius: 6px;
            background-color: white;
            margin: ${theme.tbmargin} ${theme.lrmargin};
            border: 1px solid ${theme.bordercolor};
          }
          .circle {
            height: 10px;
            width: 10px;
            border-radius: 100%;
            background-color: ${theme.maincolor};
            margin: 10px;
          }
          .rightCircle {
            height: 10px;
            width: 10px;
            border-radius: 100%;
            background-color: ${theme.maincolor};
            margin: 10px;
            float: right;
          }
          .contentView {
            text-align: center;
            flex: 1;
            padding: 0px 0 20px;
            align-items: center;
            justify-content: center;
            color: ${theme.mainfontcolor};
            
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
