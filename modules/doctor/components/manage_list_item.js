import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import {theme} from 'components'
import {ORDERINFO, DOCTORINFO, HOSPITALINFO} from 'config'

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
			<ul className='flex tb-flex listItem'>
				{
					newTitleInfo.map((item, iKey) => {
						const orderCon = `orderCon${iKey}`
						return eval(orderCon + '(props, item, iKey, key)')
					})
				}
				<article className='clearfix'></article>
			</ul>
    )
  }
}

const normalHtml = (data, item, iKey) => {
	return (
		<li className={'left textoverflow1'} key={iKey} style={item.style}>
			{data || '无'}
		</li>
	)
}

const orderCon0 = (props, item, iKey, key) => {
	return (
		<li style={item.style} key={iKey}>{key + 1}</li>
	)
}

const orderCon1 = (props, item, iKey) => {
	return (normalHtml(props.data.doctorSn, item, iKey))
}

const orderCon2 = (props, item, iKey) => {
	return (normalHtml(props.data.doctorName, item, iKey))
}

const orderCon3 = (props, item, iKey) => {
	const data = props.data || {}
	return (normalHtml(data.departmentHasDoctors &&
			data.departmentHasDoctors[0] &&
			data.departmentHasDoctors[0].department &&
			data.departmentHasDoctors[0].department.hospital &&
			data.departmentHasDoctors[0].department.hospital.hospitalName, item, iKey))
}

const orderCon4 = (props, item, iKey) => {
	const curStatus = ORDERINFO && ORDERINFO.order_type && ORDERINFO.order_type.filter((item) => item.value === props.data.status) || []
	const data = props.data || {}
	return (normalHtml(data.departmentHasDoctors &&
			data.departmentHasDoctors[0] &&
			data.departmentHasDoctors[0].department &&
			data.departmentHasDoctors[0].department.deptName, item, iKey))
}

const btnHtml = (props, item, iKey) => {
	return (<li className={'left textoverflow1'} key={iKey} style={item.style}>
				<span style={{color: theme.maincolor, cursor: 'pointer'}} onClick={() => props.clickShowModal(props.data, 'modify')}>{'设置'}</span>
			</li>)
}

const orderCon5 = (props, item, iKey) => {
	const data = props.data || {}
	if (item.title.indexOf('设置') > -1) {
		return (btnHtml(props, item, iKey))
	}
	return (normalHtml(data.departmentHasDoctors &&
			data.departmentHasDoctors[0] &&
			data.departmentHasDoctors[0].department &&
			data.departmentHasDoctors[0].department.childs &&
			data.departmentHasDoctors[0].department.childs[0] &&
			data.departmentHasDoctors[0].department.childs[0].deptName, item, iKey))
}

const orderCon6 = (props, item, iKey) => {
	if (item.title.indexOf('服务开通状态') > -1) {
		let openStatus = [
			{img: props.data.imageAndTextOpen ? 'chat1Cur' : 'chat1', style: {height: '.16rem'}},
			{img: props.data.quikeOpen ? 'chat2Cur' : 'chat2', style: {height: '.16rem', padding: `0 ${theme.tbmargin}`}},
			{img: props.data.videoOpen ? 'viedoCur' : 'viedo', style: {height: '.16rem'}}
		]
		return (
			<li className={'left flex tb-flex'} key={iKey} style={item.style}>
				{
					openStatus.map((openstatusItem, openstatusIkey) => {
						return (
							<img key={openstatusIkey} src={`/static/${HOSPITALINFO.hospital_short_name}/${openstatusItem.img}.png`} style={openstatusItem.style} />
						)
					})
				}
		</li>)
	}
	if (item.title.indexOf('图文问诊') > -1) {
		return (normalHtml(props.data.imageAndTextPrice, item, iKey))
	}
}

const orderCon7 = (props, item, iKey) => {
	if (item.title.indexOf('设置') > -1) {
		return (btnHtml(props, item, iKey))
	}
	if (item.title.indexOf('快速问诊') > -1) {
		return (normalHtml(props.data.quikePrice, item, iKey))
	}
}

const orderCon8 = (props, item, iKey) => {
	if (item.title.indexOf('服务开通状态') > -1) {
		return (btnHtml(props, item, iKey))
	}
	if (item.title.indexOf('视频问诊') > -1) {
		return (normalHtml(props.data.videoPrice, item, iKey))
	}
}

const orderCon9 = (props, item, iKey) => {
	return (btnHtml(props, item, iKey))
}
