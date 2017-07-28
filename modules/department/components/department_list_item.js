import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import {theme} from 'components'
import {ORDERTYPE, DOCTORINFO, HOSPITALINFO} from 'config'

export default class DepartmentListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
	}

  render () {
		// const data = this.props.data || {}
		const key = this.props.index
		const props = this.props
		const {titleInfo} = this.props
    return (
			<ul className='flex tb-flex listItem'>
				{
					titleInfo.map((item, iKey) => {
						const orderCon = `orderCon${this.props.page}${iKey}`
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
		<li className={'left textoverflow1'} key={iKey} style={item && item.style}>
			{data || '无'}
		</li>
	)
}

const recommandHtml = (props, item, iKey, isData) => {
	return (
		<li className={'left textoverflow1'} key={iKey} style={item.style}>
			{isData ? '是' : '否'}
		</li>
	)
}

const buttonhtml = (props, item, iKey) => {
	return (
		<li className={'left flex tb-flex lr-flex'} key={iKey} style={item.style}>
			<img src={`/static/icons/modify.png`} style={{height: '.16rem'}} onClick={() => props.clickShowModal(props.data, 'modify')} />
			{/* <img src={`/static/icons/delete.png`} style={{height: '.16rem', padding: `0 ${theme.tbmargin}`}} onClick={() => props.clickShowModal(data, 'delete')} /> */}
		</li>)
}

const orderConlevel10 = (props, item, iKey, key) => {
	return (normalHtml((key+1), item, iKey))
}

const orderConlevel11 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderConlevel12 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderConlevel13 = (props, item, iKey) => {
	return (normalHtml(props.data && props.data.hospital && props.data.hospital.hospitalName, item, iKey))
}

const orderConlevel14 = (props, item, iKey) => {
	if (item.title.indexOf('是否推荐') > -1) {
		return (recommandHtml(props, item, iKey, props.data[item.apiKey]))
	}
}

const orderConlevel15 = (props, item, iKey) => {
	if (item.title.indexOf('是否可挂号') > -1) {
		return (recommandHtml(props, item, iKey, props.data[item.apiKey]))
	}
}

const orderConlevel16 = (props, item, iKey) => {
	if (item.title.indexOf('科室介绍') > -1) {
		return (normalHtml(props.data[item.apiKey], item, iKey))
	}
	if (item.title.indexOf('设置一级科室') > -1) {
		return (
			buttonhtml(props, item, iKey)
		)
	}
}

const orderConlevel17 = (props, item, iKey) => {
	return (
		buttonhtml(props, item, iKey)
	)
}





const orderConlevel20 = (props, item, iKey, key) => {
	return (normalHtml((key+1), item, iKey))
}

const orderConlevel21 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderConlevel22 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderConlevel23 = (props, item, iKey) => {
	return (normalHtml(props.data.hospital && props.data.hospital.hospitalName, item, iKey))
}

const orderConlevel24 = (props, item, iKey) => {
	return (normalHtml(props.data.parent && props.data.parent.deptName, item, iKey))
}

const orderConlevel25 = (props, item, iKey) => {
	return (recommandHtml(props, item, iKey, props.data[item.apiKey]))
}

const orderConlevel26 = (props, item, iKey) => {
	return (recommandHtml(props, item, iKey, props.data[item.apiKey]))
}

const orderConlevel27 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderConlevel28 = (props, item, iKey) => {
	return (
		buttonhtml(props, item, iKey)
	)
}

