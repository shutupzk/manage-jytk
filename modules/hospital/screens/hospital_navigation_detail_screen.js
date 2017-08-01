import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERTYPE} from 'config'
import {HOSPITALINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryHospitals, showPrompt, queryBuildingDetail, updateBuilding, updateFloor, updateRoom } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem, HospitalDetailModal, HospitalNavigationDetail} from '../components'


class HospitalNavigationDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
		this.props.queryHospitals(this.props.client)
		this.props.queryBuildingDetail(this.props.client, {id: this.props.url.query.id})
	}

	async goCreate(values) {
		console.log('---values', values)
		const {id} = this.props.url && this.props.url.query
		const {floors, hospitalId, buildName} = values; 
		let error = await this.props.updateBuilding(
			this.props.client,
			{hospitalId, name: buildName, id}
		)
		if (error) {
			this.props.showPrompt({text: error});
			return
		} else {
			for(const nsdKey in floors) {
				if (!this.props.building.id) {
					this.props.showPrompt({text: '未获取到buildingID'})
					return;
				}
				let error = await this.props.updateFloor(
					this.props.client, {
						buildingId: this.props.building.id,
						floorNum: floors[nsdKey].floorNum,
						id
					}
				)
				if (error) {
					this.props.showPrompt({text: error});
					return
				} else {
					for(const roomKey in floors[nsdKey].rooms) {
						if (!this.props.floor.id) {
							this.props.showPrompt({text: '未获取到floorID'})
							return;
						}
						let error = await this.props.updateRoom(
							this.props.client, {
								floorId: this.props.floor.id,
								name: floors[nsdKey].rooms[roomKey].name,
								id
							}
						)
						if (error) {
							this.props.showPrompt({text: error});
							return
						}
					}
				}
			}
		}
		Router.push('/hospital/hospital_navigation')
	}

  render () {
    return (
			<HospitalNavigationDetail
				detailPage
				{...this.props}
				goCreate={(values) => this.goCreate(values)} />
    )
  }
}


function mapStateToProps (state) {
  return {
    building: state.buildings.building,
    loading: state.buildings.loading,
		error: state.buildings.error,
		hospital: state.hospital.data,
		floor: state.buildings.floor
  }
}

export default connect(mapStateToProps, { queryHospitals, showPrompt, queryBuildingDetail, updateBuilding, updateFloor, updateRoom })(HospitalNavigationDetailScreen)
