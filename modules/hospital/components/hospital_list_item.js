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
			<ul className='flex tb-flex'>
				{
					newTitleInfo.map((item, iKey) => {
						const orderCon = `orderCon${page}${iKey}`
						return eval(orderCon + '(data, item, key, props)')
					})
				}
				<article className='clearfix'></article>
				<style jsx>{`
					ul{
						padding: 0 15px;
						color: ${theme.mainfontcolor};
						line-height: .36rem;
						font-size: ${theme.nfontsize};
						box-sizing: content-box;
					}
					ul:nth-of-type(2n+1) {
						background: #FBFBFB;
					}
				`}</style>
			</ul>
    )
  }
}

const orderConnavi0 = (data, item, key) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			 {data.hospital.hospitalName || '无'}
		</li>
	)
}

const orderConnavi1 = (data, item, key) => {
	return (
		<li className={'left flex tb-flex'} style={item.style}>
			 {data.name}
			 {
				 data.floors && data.floors.map((floorItem, iKey) => {
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

const orderConnavi2 = (data, item, key, props) => {
	return (
		<li className={'left flex tb-flex lr-flex'} style={item.style}>
			<img src={`/static/icons/modify.png`} style={{height: '.16rem'}} onClick={() => props.clickModify(data)} />
			{/* <img src={`/static/icons/delete.png`} style={{height: '.16rem', padding: `0 ${theme.tbmargin}`}} onClick={() => props.clickShowModal(data, 'delete')} /> */}
		</li>)
}

const orderConguide0 = (data, item, key) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			 {data[item.apiKey] || '无'}
		</li>
	)
}

const orderConguide1 = (data, item, key) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			 {data[item.apiKey] }
		</li>
	)
}
const orderConguide2 = (data, item, key) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			 {data.visitNoticeGroup.name || '无'}
		</li>
	)
}

const orderConguide3 = (data, item, key) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			 {data[item.apiKey]}
		</li>
	)
}

const orderConguide4 = (data, item, key, props) => {
	return (
		<li className={'left flex tb-flex lr-flex'} style={item.style}>
			<img src={`/static/icons/modify.png`} style={{height: '.16rem'}} onClick={() => props.clickShowModal(data, 'modify')} />
			{/* <img src={`/static/icons/delete.png`} style={{height: '.16rem', padding: `0 ${theme.tbmargin}`}} onClick={() => props.clickShowModal(data, 'delete')} /> */}
		</li>)
}


const orderConfun0 = (data, item, key) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			 {data[item.apiKey] || '无'}
		</li>
	)
}

const orderConfun1 = (data, item, key) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			 {data[item.apiKey] ? '是' : '否'}
		</li>
	)
}

const orderConfun2 = (data, item, key) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			 {data[item.apiKey] || '无'}
		</li>
	)
}
const orderConintro0 = (data, item, key) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{
				item.title.indexOf('logo') > -1 ?
					<img width='50px' src={data[item.apiKey]} /> 
				:
					data[item.apiKey]
			}
			 
		</li>
	)
}

const orderConintro1 = (data, item) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data[item.apiKey] || '无'}
		</li>
	)
}

const orderConintro2 = (data, item) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data[item.apiKey]}
		</li>
	)
}

const orderConintro3 = (data, item, key, props) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data[item.apiKey]|| '无'}
		</li>
	)
}

const orderConintro4 = (data, item, key, props) => {
	return (
		<li className={'left flex tb-flex lr-flex'} style={item.style}>
			<img src={`/static/icons/modify.png`} style={{height: '.16rem'}} onClick={() => props.clickShowModal(data, 'modify')} />
			{/* <img src={`/static/icons/delete.png`} style={{height: '.16rem', padding: `0 ${theme.tbmargin}`}} onClick={() => props.clickShowModal(data, 'delete')} /> */}
		</li>)
}

