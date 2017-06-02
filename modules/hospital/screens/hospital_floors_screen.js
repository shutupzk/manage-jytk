import React, { Component } from 'react'
import { connect } from 'react-redux'

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
    let buildingId = this.props.url.query.buildingId
    this.props.selectHospitalBuildings({buildingId})
    this.props.queryHospitalBuildings(this.props.client, {hospitalId})
    this.setState({isInit: false})
  }
  render () {
    if (this.props.loading || this.state.isInit) {
      return (
        <div>
          <div>loading...</div>
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <div>error...</div>
        </div>
      )
    }
    let {hospitals, selectId, selectBuildingId} = this.props
    let hosiptal = hospitals[selectId]
    let buildings = hosiptal.buildings || []
    let building = filterBuildings(buildings, selectBuildingId)
    return (
      <div>
        <div style={styles.titleView}>
          <div style={styles.circle} />
          <div style={styles.contentView}>
            <div style={styles.hospitalText}>{hosiptal.hospitalName}</div>
            <div style={styles.text}>{building.name}</div>
          </div>
          <div style={styles.circle} />
        </div>
        {
          building.floors.map((item, i) => (
            <div key={i} style={styles.floorsView}>
              <div style={styles.floorsLeftView}>
                <div style={styles.floorLeftLeftView}>&nbsp; </div>
                <span style={styles.floorLeftText}>{item.floorNum}</span>
              </div>
              <div style={{padding: 10}}>
                {
                  item.rooms.map((room) => {
                    return (
                      <span key={room.id} style={styles.itemText}>{room.name}</span>
                    )
                  })
                }
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}

const styles = {
  titleView: {
    height: 70,
    borderRadius: 5,
    backgroundColor: 'white',
    margin: 5,
    flexDirection: 'row',
    display: 'flex'
  },
  circle: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#3CA0FF',
    margin: 6
  },
  rightCircle: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#3CA0FF',
    margin: 6,
    float: 'right'
  },
  contentView: {
    textAlign: 'center',
    flex: 1,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  text: {
    textAlign: 'center',
    margin: 5,
    fontSize: 18,
    color: '#505050'
  },
  hospitalText: {
    textAlign: 'center',
    margin: 5,
    fontSize: 15,
    color: '#B4B4B4'
  },
  floorsView: {
    borderRadius: 5,
    backgroundColor: 'white',
    margin: 5,
    flexDirection: 'row',
    display: 'flex'
  },
  floorsLeftView: {
    float: 'left',
    flexDirection: 'row',
    width: 40,
    margin: 5
  },
  floorLeftLeftView: {
    float: 'left',
    height: 20,
    width: 3,
    backgroundColor: '#D8D8D8'
  },
  floorLeftText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#505050',
    marginLeft: 3
  },
  flatlist: {
    marginVertical: 5
  },
  itemText: {
    flex: 1,
    margin: 3,
    fontSize: 14,
    color: '#505050'
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
