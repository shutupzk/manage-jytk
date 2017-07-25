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
			<ul className='flex tb-flex'>
				{
					titleInfo.map((item, iKey) => {
						const orderCon = `orderCon${iKey}`
						return eval(orderCon + '(props, item, iKey, key)')
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

const normalHtml = (data, item, iKey) => {
	return (
		<li className={'left textoverflow1'} key={iKey} style={item.style}>
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

const orderCon0 = (props, item, iKey, key) => {
	return (
		<li key={iKey} style={item.style}>{key + 1}</li>
	)
}

const orderCon1 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderCon2 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderCon3 = (props, item, iKey) => {
	if (item.title.indexOf('是否推荐') > -1) {
		return (recommandHtml(props, item, iKey, props.data[item.apiKey]))
	}
}

const orderCon4 = (props, item, iKey) => {
	if (item.title.indexOf('是否可挂号') > -1) {
		return (recommandHtml(props, item, iKey, props.data[item.apiKey]))
	}
}

const orderCon5 = (props, item, iKey) => {
	if (item.title.indexOf('科室介绍') > -1) {
		return (normalHtml(props.data[item.apiKey], item, iKey))
	}
	if (item.title.indexOf('设置一级科室') > -1) {
		return (
			buttonhtml(props, item, iKey)
		)
	}
}

const orderCon6 = (props, item, iKey) => {
	return (
		buttonhtml(props, item, iKey)
	)
}

