import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERTYPE} from 'config'
import {HOSPITALINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import {HospitalListItem, HospitalDetailModal} from './index'


export default class HospitalNavigationDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
			floors: []
    }
  }

  componentWillMount() {
	}
	
	componentWillReceiveProps(nextProps) {
		if (this.props.url && this.props.url.query && this.props.url.query.id &&
			this.state.floors.length === 0 &&
			nextProps.building.floors && nextProps.building.floors.length > 0) {
			this.setState({
				floors: nextProps.building.floors
			})
		}
	}
	
	clickBtn() {
		const {floors} = this.state;
		const funcName = this.props.createbuilding;
		const hospitalId = this.refs.hospitalId.value
		const buildName = this.refs.buildRef.value
		if (!hospitalId) {
			this.props.showPrompt({text: '请选择所在医院'})
			return;
		}
		if (!buildName) {
			this.props.showPrompt({text: '请输入楼宇名称'})
			return;
		}
		for(const floorKey in floors) {
			if (!floors[floorKey].floorNum) {
				this.props.showPrompt({text: '请输入楼层名称'})
				return;
			}
			for(const roomKey in floors[floorKey].rooms) {
				if (!floors[floorKey].rooms[roomKey].name) {
					this.props.showPrompt({text: '请输入房间名称'})
					return;
				}
			}
		}
		this.props.goCreate({hospitalId, buildName, floors: this.state.floors})
	}

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		if (this.props.error) {
			this.props.showPrompt({text: this.props.error})
			return <div>{this.props.error}</div>
		}
		let hospital = this.props.hospital
		const floors = this.state.floors;
		const building = this.props.building || {}
		console.log('--------this.floors', building.floors, this.state.floors)
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
					<dd className='roundDD' style={{borderBottom: `1px solid ${theme.bordercolor}`, cursor: 'pointer', color: theme.maincolor, textAlign: 'right'}}
					onClick={() => {
						let newFloor = [{floorNum: '', rooms: []}]
						this.setState({
							floors: newFloor.concat(floors)
						})
					}}>添加楼层</dd>
				</dl>
				<div style={{paddingLeft: '.7rem'}}>
					{
						floors && floors.map((floor, iKey) => {
							return (
								<div key={iKey} className='floorCon'>
									{floorView(this, floor, iKey)}
									{roomView(this, floor, iKey)}
								</div>
							)
						})
					}
				</div>
				<footer style={{padding: '.2rem'}}>
					<button className='btnBG btnBGMain btnBGLitt' onClick={() => {
						this.clickBtn()
					}}>确定</button>
				</footer>
				<style jsx global>{`
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
					.floorCon:not(:first-child) {
						border-top: 1px solid ${theme.bordercolor}
					}
				`}</style>
      </div>
    )
  }
}

const floorView = (self, floor, iKey) => {
	const {floors} = self.state
	return (
		<dl className='flex tb-flex'>
			<dt>楼层名称: </dt>
			<dd><input type='text'
			value={floor.floorNum}
			onChange={(e) => {
				let newFloors = []
				for(const othKey in floors) {
					if (othKey != iKey) {
						newFloors.push(floors[othKey])
					} else {
						newFloors.push({floorNum: e.target.value, rooms: floor.rooms})
					}
				}
				self.setState({
					floors: newFloors
				})
			}} /></dd>
			<dd style={{padding: '0 6px', color: theme.maincolor, cursor: 'pointer'}}
				onClick={() => {
					let newFloor = []
					for(const othKey in floors) {
						if (othKey != iKey) {
							newFloor.push(floors[othKey])
						}
					}
					self.setState({
						floors: newFloor
					})
				}}>删除楼层</dd>
			<dd style={{color: theme.maincolor, cursor: 'pointer'}}
				onClick={() => {
					let newRoom = [{name: ''}]
					let newRooms = newRoom.concat(floor.rooms)
					let newFloors = []
					let newFloor = {floorNum: '', rooms: newRooms}
					for(const othKey in floors) {
						if (othKey != iKey) {
							newFloors.push(floors[othKey])
						} else {
							newFloor.floorNum = floors[iKey].floorNum
							newFloors.push(newFloor)
						}
					}
					self.setState({
						floors: newFloors
					})
				}}>添加房间</dd>
		</dl>
	)
}

const roomView = (self, floor, iKey) => {
	const {floors} = self.state
	return (
		<div style={{paddingLeft: '.7rem'}}>
			{
				floor && floor.rooms && floor.rooms.length > 0 ?
					floor.rooms.map((room, index) => {
						return (
							<dl className='flex tb-flex' key={index}>
								<dt>房间名称: </dt>
								<dd><input type='text'
									value={floor.rooms[index].name}
									onChange={(e) => {
										let newRooms = []
										for (const othRoomKey in floor.rooms) {
											if (othRoomKey != index) {
												newRooms.push(floor.rooms[othRoomKey])
											} else {
												newRooms.push({name: e.target.value})
											}
										}
										let newFloors = []
										for (const othFloorKey in floors) {
											if (othFloorKey != iKey) {
												newFloors.push(floors[othFloorKey])
											} else {
												newFloors.push({floorNum: floors[othFloorKey].floorNum, rooms: newRooms})
											}
										}
										self.setState({
											floors: newFloors
										})
									}} /></dd>
								<dd style={{padding: '0 6px', color: theme.maincolor}}
									onClick={() => {
										let newRooms = []
										let newFloors = []
										for(const othKey in floors) {
											if (othKey != iKey) {
												newFloors.push(floors[othKey])
											} else {
												for(const othRoomKey in floor.rooms) {
													if (othRoomKey != index) {
														newRooms.push(floor.rooms[othRoomKey])
													}
												}
												newFloors.push({floorNum: floor.floorNum, rooms: newRooms})
											}
										}
										self.setState({
											floors: newFloors
										})
									}}>删除房间</dd>
							</dl>
						)
					})
				: ''
			}
		</div>
	)
}


