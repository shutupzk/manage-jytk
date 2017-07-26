import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import {theme} from 'components'
import {ORDERTYPE, DOCTORINFO, HOSPITALINFO} from 'config'

export default class HospitalListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
	}

  render () {
		const data = this.props.data || {}
		const key = this.props.index
		const props = this.props
		const {titleInfo, page} = this.props
		let newTitleInfo = titleInfo.filter((item) => item.nolistShow !== true)
    return (
			<ul className='flex tb-flex listItem'>
				{
					newTitleInfo.map((item, iKey) => {
						const orderCon = `orderCon${page}${iKey}`
						return eval(orderCon + '(props, item, iKey)')
					})
				}
				<article className='clearfix'></article>
			</ul>
    )
  }
}

const orderConnavi0 = (props, item, iKey) => {
	return (normalHtml(props.data.hospital.hospitalName, item, iKey))
}

const orderConnavi1 = (props, item, iKey) => {
	return (
		<li className={'left flex tb-flex'} key={iKey} style={item.style}>
			 {props.data.name}
			 {
				 props.data.floors && props.data.floors.map((floorItem, iKey) => {
					 return (
						 <article key={iKey}>
						 	<span><span style={{padding: '0 6px'}}>|</span>{floorItem.floorNum}</span>
							 {
								 floorItem.rooms && floorItem.rooms.map((roomItem, roomKey) => {
									 return (
										 <span key={roomKey}><span style={{padding: '0 6px'}}>|</span>{roomItem.name}</span>
									 )
								 })
							 }
						 </article>
					 )
				 })
			 }
		</li>
	)
}

const orderConnavi2 = (props, item, iKey) => {
	return (btnHtml(props, item, iKey))
}

const orderConguide0 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderConguide1 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}
const orderConguide2 = (props, item, iKey) => {
	return (normalHtml(props.data.visitNoticeGroup.name, item, iKey))
}

const orderConguide3 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}


const orderConguide4 = (props, item, iKey) => {
	return (btnHtml(props, item, iKey))
}


const orderConfun0 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderConfun1 = (props, item, iKey) => {
	return (boolHtml(props.data[item.apiKey], item, iKey))
}

const orderConfun2 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}
const normalHtml = (data, item, iKey) => {
	return (
		<li className={'left textoverflow1'} key={iKey} style={item.style}>
			 {data || '无'}
		</li>
	)
}

const boolHtml = (data, item, iKey) => {
	return (
		<li className={'left textoverflow1'} key={iKey} style={item.style}>
			 {data ? '是' : '否'}
		</li>
	)
}

const btnHtml = (props, item, iKey) => {
	return (
		<li className={'left flex tb-flex lr-flex'} key={iKey} style={item.style}>
			{
				item.title.indexOf('设置导航') > -1 ?

				<img src={`/static/icons/modify.png`} style={{height: '.16rem'}} onClick={() => props.clickGoDetailPage(props.data, 'modify')} />
			:

				<img src={`/static/icons/modify.png`} style={{height: '.16rem'}} onClick={() => props.clickShowModal(props.data, 'modify')} />
			}
			{/* <img src={`/static/icons/delete.png`} style={{height: '.16rem', padding: `0 ${theme.tbmargin}`}} onClick={() => props.clickShowModal(data, 'delete')} /> */}
		</li>)
}
const orderConintro0 = (props, item, iKey) => {
	return (
		<li className={'left textoverflow1'} key={iKey} style={item.style}>
			{
				item.title.indexOf('logo') > -1 ?
					<img width='50px' src={props.data[item.apiKey]} /> 
				:
					props.data[item.apiKey]
			}
			 
		</li>
	)
}

const orderConintro1 = (props, item, iKey) => {
	return (
		normalHtml(props.data[item.apiKey], item, iKey)
	)
}

const orderConintro2 = (props, item, iKey) => {
	return (
		normalHtml(props.data[item.apiKey], item, iKey)
	)
}

const orderConintro3 = (props, item, iKey) => {
	return (
		normalHtml(props.data[item.apiKey], item, iKey)
	)
}

const orderConintro4 = (props, item, iKey) => {
	return (btnHtml(props, item, iKey))
}

