import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERTYPE} from 'config'
import {HOSPITALINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryHospitals, showPrompt, createbuilding, updateHospital, createFloor, createRoom, queryBuildingDetail } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem, HospitalDetailModal} from '../components'


class HospitalNavigationDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			newStateData: [], // [{floor: name, rooms: [name, ]}]
    }
  }

  componentWillMount() {
		this.props.queryHospitals(this.props.client)
		if (this.props.url && this.props.url.query && this.props.url.query.id) {
			this.props.queryBuildingDetail(this.props.client, {id: this.props.url.query.id})
		}
	}
	
	componentWillReceiveProps(nextProps) {
		if (this.props.url && this.props.url.query && this.props.url.query.id &&
			this.state.newStateData.length === 0 &&
			nextProps.building.floors && nextProps.building.floors.length > 0) {
			console.log('-------nextProps------')
			this.setState({
				newStateData: nextProps.building.floors
			})
		}
	}
	
	async goCreate() {
		// createRoom
		// createFloor
		const {newStateData} = this.state;
		let error = await this.props.createbuilding(
			this.props.client, {
				hospitalId: this.refs.hospitalId.value,
				name: this.refs.buildRef.value
			}
		)
		// if (modalType === 'modify') {
		// 	values.id = this.state.selectedHospital.id
		// 	error = await this.props.updateHospital(this.props.client, values)
		// }
		// else if (modalType === 'add') {
		// 	error = await this.props.createbuilding(this.props.client, values)
		// }
		if (error) {
			this.props.showPrompt({text: error});
			// return
		} else {
			console.log('-----this.props.building', this.props.building)
			for(const nsdKey in newStateData) {
				let error = await this.props.createFloor(
					this.props.client, {
						buildingId: this.props.building.id,
						floorNum: newStateData[nsdKey].floorNum
					}
				)
				if (error) {
					this.props.showPrompt({text: error});
					return
				} else {
					console.log('------this.props.floor.id', this.props.floor)
					for(const roomKey in newStateData[nsdKey].rooms) {
						let error = await this.props.createRoom(
							this.props.client, {
								floorId: this.props.floor.id,
								name: newStateData[nsdKey].rooms[roomKey].name
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
		// await this.props.showPrompt('更新成功');
		Router.push('/hospital/hospital_navigation')
		// return this.props.navigation.goBack(null)
	}

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		if (this.props.error) {
			this.props.showPrompt(this.props.error)
			// return console.log(this.props.error)
			return <div>{this.props.error}</div>
		}
		let hospital = this.props.hospital
		const newStateData = this.state.newStateData;
		const building = this.props.building || {}
		console.log('--------this.newStateData', this.props, newStateData)
    return (
      <div style={{width: '70%', margin: '20px auto'}}>
				<dl className='flex tb-flex'>
					<dt>所在医院: </dt>
					<dd className='select roundDD' style={{borderRadius: 0, width: '50%', padding: 0}}>
						<select ref='hospitalId' defaultValue={building.hospital && building.hospital.id}>
							<option value="">请选择</option>
							{
								hospital && hospital.length > 0 ?
									hospital.map((hospitalItem) => {
										return (
											<option key={hospitalItem.id} value={hospitalItem.id}>{hospitalItem.hospitalName}</option>
										)
									})
								: 'no hospital'
							}
						</select>
					</dd>
				</dl>
				<dl className='flex tb-flex'>
					<dt>楼宇名称: </dt>
					<dd className='roundDD'><input defaultValue={building.name} type='' ref='buildRef' /></dd>
				</dl>
				<dl className='flex tb-flex'>
					<dt>楼层名称</dt>
					<dd className='roundDD' style={{borderBottom: `1px solid ${theme.bordercolor}`, color: theme.maincolor, textAlign: 'right'}}
					onClick={() => {
						const prevState = this.state.newStateData;
						prevState.push({floorNum: '', rooms: []})
						 this.setState({
							newStateData: prevState
						}) 
					}}>添加楼层</dd>
				</dl>
				<div style={{paddingLeft: '.7rem'}}>
					{
						newStateData && newStateData.map((floor, iKey) => {
							return (
								<div key={iKey}>
									<dl className='flex tb-flex'>
										<dt>楼层名称: </dt>
										<dd><input type=''
										defaultValue={newStateData[iKey].floorNum}
										onChange={(e) => {
											let newData = newStateData
											newData[iKey].floorNum = e.target.value
											 this.setState({
												newStateData: newData
											})
										}} /></dd>
										<dd style={{padding: '0 6px', color: theme.maincolor}}
											onClick={() => {
												let newnewStateData = newStateData
												newnewStateData[iKey] = {}
												this.setState({
													newStateData: newnewStateData
												})
											}}>删除楼层</dd>
										<dd style={{color: theme.maincolor}}
											onClick={() => {
												let newnewStateData = newStateData
												newnewStateData[iKey].rooms.push({name: ''})
												this.setState({
													newStateData: newnewStateData
												})
											}}>添加房间</dd>
									</dl>
									<div style={{paddingLeft: '.7rem'}}>
										{
											newStateData && newStateData[iKey] && newStateData[iKey].rooms.length > 0 ?
												newStateData[iKey].rooms.map((room, index) => {
													return (
														<dl className='flex tb-flex' key={index}>
															<dt>房间名称: </dt>
															<dd><input type=''
																value={newStateData[iKey].rooms[index].name}
																onChange={(e) => {
																	let newnewStateData = newStateData
																	newnewStateData[iKey].rooms[index].name = e.target.value
																	this.setState({
																		newStateData: newnewStateData
																	})
																}} /></dd>
															<dd style={{padding: '0 6px', color: theme.maincolor}}
															onClick={() => {
																let newnewStateData = newStateData
																newnewStateData[iKey].rooms.splice(index, 1)
																this.setState({
																	newStateData: newnewStateData
																})
															}}>删除房间</dd>
														</dl>
													)
												})
											: ''
										}
									</div>
								</div>
							)
						})
					}
				</div>
				<footer style={{paddingLeft: '.2rem'}}>
					<button className='btnBG btnBGMain btnBGLitt' onClick={() => {
						this.goCreate()
					}}>确定</button>
				</footer>
				<style jsx>{`
					dl{
						padding: ${theme.tbmargin} 0;
					}
					dt{
						padding-right: ${theme.tbmargin};
						color: ${theme.fontcolor};
					}
					.roundDD{
						width: 50%;
					}
					input {
						line-height: 32px;
						min-width: 2rem;
					}
					.roundDD input{
						width: 100%;
					}
				`}</style>
      </div>
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

export default connect(mapStateToProps, { queryHospitals, showPrompt, createbuilding, updateHospital, createFloor, createRoom, queryBuildingDetail })(HospitalNavigationDetailScreen)
