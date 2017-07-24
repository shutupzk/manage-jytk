import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import {theme} from 'components'
import {ORDERTYPE, DOCTORINFO, HOSPITALINFO} from 'config'

export default class ManageListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
	}

  render () {
		const data = this.props.data || {}
		const key = this.props.index
		const props = this.props
		const {titleInfo} = this.props
		let newTitleInfo = titleInfo.filter((item) => item.nolistShow !== true)
    return (
			<ul className='flex tb-flex'>
				{
					newTitleInfo.map((item, iKey) => {
						const orderCon = `orderCon${iKey}`
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

const orderCon0 = (data, item, key) => {
	return (
		<li style={item.style}>{key + 1}</li>
	)
}

const orderCon1 = (data, item) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data.doctorSn|| '无'}
		</li>
	)
}

const orderCon2 = (data, item) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data.doctorName|| '医生'}
		</li>
	)
}

const orderCon3 = (data, item) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data.departmentHasDoctors &&
			data.departmentHasDoctors[0] &&
			data.departmentHasDoctors[0].department &&
			data.departmentHasDoctors[0].department.hospital &&
			data.departmentHasDoctors[0].department.hospital.hospitalName || '无'}
		</li>
	)
}

const orderCon4 = (data, item) => {
	const curStatus = ORDERTYPE.filter((item) => item.value === data.status) || []
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data.departmentHasDoctors &&
			data.departmentHasDoctors[0] &&
			data.departmentHasDoctors[0].department &&
			data.departmentHasDoctors[0].department.deptName|| '无'}
		</li>
	)
}

const orderCon5 = (data, item, key, self) => {
	if (item.title.indexOf('设置') > -1) {
		return (
			<li className={'left textoverflow1'} style={item.style}>
				<span style={{color: theme.maincolor, cursor: 'pointer'}} onClick={() => self.clickShowModal(data, 'modify')}>{'设置'}</span>
			</li>)
	}
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data.departmentHasDoctors &&
			data.departmentHasDoctors[0] &&
			data.departmentHasDoctors[0].department &&
			data.departmentHasDoctors[0].department.childs &&
			data.departmentHasDoctors[0].department.childs[0] &&
			data.departmentHasDoctors[0].department.childs[0].deptName || '无'}
		</li>)
}

const orderCon6 = (data, item) => {
	if (item.title.indexOf('服务开通状态') > -1) {
		return (
			<li className={'left flex tb-flex'} style={item.style}>
				<img src={`/static/${HOSPITALINFO.hospital_short_name}/chat1.png`} style={{height: '.16rem'}} />
				<img src={`/static/${HOSPITALINFO.hospital_short_name}/chat1.png`} style={{height: '.16rem', padding: `0 ${theme.tbmargin}`}} />
				<img src={`/static/${HOSPITALINFO.hospital_short_name}/chat1.png`} style={{height: '.16rem'}} />
		</li>)
	}
	if (item.title.indexOf('用药咨询') > -1) {
		return (
			<li className={'left textoverflow1'} style={item.style}>
				{data.videoPrice}
		</li>)
	}
}

const orderCon7 = (data, item, key, self) => {
	if (item.title.indexOf('设置') > -1) {
		return (
			<li className={'left textoverflow1'} style={item.style}>
				<span style={{color: theme.maincolor, cursor: 'pointer'}} onClick={() => self.clickShowModal(data)}>{'设置'}</span>
			</li>)
	}
	if (item.title.indexOf('图文问诊') > -1) {
		return (
			<li className={'left textoverflow1'} style={item.style}>
				{data.imageAndTextPrice}
		</li>)
	}
}

const orderCon8 = (data, item, key, self) => {
	if (item.title.indexOf('服务开通状态') > -1) {
		return (
			<li className={'left textoverflow1'} style={item.style}>
				<span style={{color: theme.maincolor, cursor: 'pointer'}} onClick={() => self.clickShowModal(data)}>{'设置'}</span>
			</li>)
	}
	if (item.title.indexOf('视频问诊') > -1) {
		return (
			<li className={'left textoverflow1'} style={item.style}>
				{data.videoPrice}
		</li>)
	}
}

const orderCon9 = (data, item, key, self) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			<span style={{color: theme.maincolor, cursor: 'pointer'}} onClick={() => self.clickShowModal(data)}>{'修改'}</span>
		</li>)
}
