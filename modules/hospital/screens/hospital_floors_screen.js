import React, { Component } from 'react'
import { connect } from 'react-redux'
import {ErrCard, Loading, theme} from 'components'
import {
  queryHospitals,
  selectHospital,
  queryHospitalBuildings,
  selectHospitalBuildings
} from '../../../ducks'
import { isEmptyObject } from '../../../utils'

const filterBuildings = (buildings, selectBuildingId) => {
  let building = buildings.filter((building) => {
    if (selectBuildingId === building.id) {
      return true
    }
    return false
  })
  return building[0]
}
class IndoorNavigationDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {isInit: false}
  }
  componentWillMount () {
    const hospitals = this.props.hospitals
    if (isEmptyObject(this.props.hospitals)) {
      this.setState({isInit: true})
      this.hetHospitalWithBuildings()
    } else if (!this.getHospital(hospitals).buildings) {
      this.setState({isInit: true})
      this.getBuildings(this.getHospital(hospitals).id)
    } else {
      if (!this.props.selectBuildingId) {
        let buildingId = this.props.url.query.buildingId
        this.props.selectHospitalBuildings({buildingId})
      }
    }
  }
  getHospital (hospitals) {
    let hosiptal = {}
    for (let item in hospitals) {
      this.props.selectHospital({hospitalId: item})
      hosiptal = hospitals[item]
      break
    }
    return hosiptal
  }
  async hetHospitalWithBuildings () {
    await this.props.queryHospitals(this.props.client)
    const hospitals = this.props.hospitals
    // this.props.selectHospital({hospitalId: this.getHospital(hospitals).id})
    this.getBuildings(this.getHospital(hospitals).id)
  }
  async getBuildings (hospitalId) {
    let buildingId = this.props.url.query.buildingId
    this.props.selectHospitalBuildings({buildingId})
    await this.props.queryHospitalBuildings(this.props.client, {hospitalId})
    this.setState({isInit: false})
  }
  render () {
    if (this.props.loading || this.state.isInit) {
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
    let {hospitals, selectId, selectBuildingId} = this.props
    let hosiptal = hospitals[selectId]
    let buildings = hosiptal.buildings || []
    let building = filterBuildings(buildings, selectBuildingId)
    return (
      <div>
        <div className={'titleView'}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className={'circle'} />
            <div className={'rightCircle'} />
          </div>
          <div className={'contentView'}>
            <div style={{fontSize: 15}}>{hosiptal.hospitalName}</div>
            <div className={'text'} style={{fontWeight: '500', fontSize: 18, paddingTop: 6}}>{building.name}</div>
          </div>
        </div>
        {
          building.floors.map((item, i) => (
            <div key={i} className={'floorsView'}>
              <div className={'floorsLeftView'}>
                <div className={'floorLeftLeftView'}>&nbsp; </div>
                <span className={'floorLeftText'}>{item.floorNum}</span>
              </div>
              <div style={{padding: 10}}>
                {
                  item.rooms.map((room) => {
                    return (
                      <span key={room.id} className={'itemText'}>{room.name}</span>
                    )
                  })
                }
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
            padding: 0px 0 16px;
            align-items: center;
            justify-content: center;
            color: ${theme.mainfontcolor};
            
          }
          .floorsView {
            border-radius: 3px;
            background-color: white;
            margin: ${theme.tbmargin} ${theme.lrmargin};
            flex-direction: row;
            display: flex;
            border: 1px solid ${theme.bordercolor};
          }
          .floorsLeftView {
            padding-top: 3px;
            float: left;
            flex-direction: row;
            width: 40px;
            margin: 5px;
            display: flex;
          }
          .floorLeftLeftView {
            height: 20px;
            width: 3px;
            background-color: #D8D8D8;
          }
          .floorLeftText {
            font-size: 18px;
            font-weight: bold;
            color: #505050;
            margin-left: 3px;
          }
          .itemText {
            flex: 1;
            margin: 3px;
            font-size: 14px;
            color: #505050;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    selectBuildingId: state.hospitals.selectBuildingId,
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
})(IndoorNavigationDetailScreen)
