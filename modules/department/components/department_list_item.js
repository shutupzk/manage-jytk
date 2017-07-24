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
		const data = this.props.data || {}
		const key = this.props.index
		const props = this.props
		const {titleInfo} = this.props
    return (
			<ul className='flex tb-flex'>
				{
					titleInfo.map((item, iKey) => {
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
			{data.deptSn|| '无'}
		</li>
	)
}

const orderCon2 = (data, item) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data.deptName|| '医生'}
		</li>
	)
}

const orderCon3 = (data, item, key, props) => {
	if (item.title.indexOf('是否推荐') > -1) {
		return (recommandHtml(data, item, key, props, data.hot))
	}
}

const orderCon4 = (data, item, key, props) => {
	if (item.title.indexOf('是否') > -1) {
		return (recommandHtml(data, item, key, props, data.isAppointment))
	}
}

const orderCon5 = (data, item, key, props) => {
	if (item.title.indexOf('科室介绍') > -1) {
		return (<li className={'left textoverflow1'} style={item.style}>
			{data.description || '无'}
		</li>)
	}
	if (item.title.indexOf('设置一级科室') > -1) {
		return (
			buttonhtml(data, item, key, props)
		)
	}
}

const orderCon6 = (data, item, key, props) => {
	return (
		buttonhtml(data, item, key, props)
	)
}

const recommandHtml = (data, item, key, props, isData) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{isData ? '是' : '否'}
		</li>
	)
}

const buttonhtml = (data, item, key, props) => {
	return (
		<li className={'left flex tb-flex lr-flex'} style={item.style}>
			<img src={`/static/icons/modify.png`} style={{height: '.16rem'}} onClick={() => props.clickShowModal(data, 'modify')} />
			{/* <img src={`/static/icons/delete.png`} style={{height: '.16rem', padding: `0 ${theme.tbmargin}`}} onClick={() => props.clickShowModal(data, 'delete')} /> */}
		</li>)
}

