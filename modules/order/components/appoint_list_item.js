import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import {theme} from 'components'
import {ORDERINFO} from 'config'

export default class AppointListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
	}

  render () {
		const props = this.props || {}
		const {titleInfo} = this.props
		let newTitleInfo = titleInfo.filter((item) => item.nolistShow !== true)
    return (
			<ul className='flex tb-flex listItem'>
				{
					newTitleInfo.map((item, iKey) => {
						const orderCon = `orderCon${iKey}`
						return eval(orderCon + '(props, item, iKey)')
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
			{data|| '无'}
		</li>
	)
}

const orderCon0 = (props, item, iKey) => {
	return (normalHtml(props.data && props.data.patientName, item, iKey))
}

const orderCon1 = (props, item, iKey) => {
	return (normalHtml(props.data && props.data.hospital && props.data.hospital.hospitalName, item, iKey))
}

const orderCon2 = (props, item, iKey) => {
	return (normalHtml(props.data && props.data.visitSchedule && props.data.visitSchedule.doctor && props.data.visitSchedule.doctor.doctorName, item, iKey))
}

const orderCon3 = (props, item, iKey) => {
	return (normalHtml(props.data && props.data.visitSchedule && props.data.visitSchedule.department && props.data.visitSchedule.department.deptName, item, iKey))
}

const orderCon4 = (props, item, iKey) => {
	return (normalHtml(props.data && props.data.visitSchedule && props.data.visitSchedule.visitDate, item, iKey))
}

const orderCon5 = (props, item, iKey) => {
	let statusTitle;
	for (const status of ORDERINFO.appoint_visit_status) {
		if (status.value === (props.data && props.data.visitStatus)) {
			statusTitle = status.title
		}
	}
	return (normalHtml(statusTitle, item, iKey))
}

const orderCon6 = (props, item, iKey) => {
	return (normalHtml(props.data && props.data.payType, item, iKey))
}

const orderCon7 = (props, item, iKey) => {
	return (
		<li className={'left textoverflow1'} key={iKey} style={item.style}>
			{props.data && props.data.payStatus ? '已支付' : '未支付'}
		</li>)
}

const btnHtml = (props, item, iKey) => {
	let btns = [
		{title: '详情', value: 'detail', class: 'btnList'},
		// {title: '删除', value: 'detail', class: 'btnList btnListDelete'}
	]
	if (props.data && props.data.visitStatus === '01') {
		btns.push({title: '取消挂号', value: 'cancel', class: 'btnList btnListModify'})
	}
	return (
		<li className={'left flex tb-flex lr-flex'} key={iKey} style={item.style}>
			{
				btns.map((btn, btnKey) => {
					return (
						<button className={btn.class} key={btnKey}
							onClick={() => props.clickConfirm(props.data, btn.value)}>{btn.title}</button>
					)
				})
			}
		</li>)
}

const orderCon8 = (props, item, iKey) => {
	return (btnHtml(props, item, iKey))
}

