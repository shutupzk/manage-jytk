import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
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
    let hosiptal = {}
    for (let item in this.props.hospitals) {
      hosiptal = this.props.hospitals[item]
      break
    }
    let buildings = hosiptal.buildings || []
    return (
      <div>
        <div style={styles.titleView}>
          <div style={styles.circle} />
          <div style={styles.contentView}>
            <span style={styles.text}>{hosiptal.hospitalName}</span>
          </div>
          <div style={styles.rightCircle} />
        </div>
        {
          buildings.map((item, i) => (
            <div key={i} onClick={() => {
              Router.push('/hospital/floors?buildingId=' + item.id)
              this.props.selectHospitalBuildings({buildingId: item.id})
            }}>
              <div style={styles.titleView}>
                <div style={styles.contentView}>
                  <span style={styles.text}>{item.name}</span>
                </div>
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
    height: 50,
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
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    color: '#505050'
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
