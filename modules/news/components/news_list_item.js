import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import {theme} from 'components'
import {ORDERTYPE, DOCTORINFO, HOSPITALINFO} from 'config'

export default class NewsListItem extends Component {
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
		<li className={'left textoverflow1'} style={item.style}>
			{data[item.apiKey]|| '无'}
		</li>
	)
}

const orderCon1 = (data, item) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data.newsGroup && data.newsGroup.type || '无'}
		</li>
	)
}

const orderCon2 = (data, item) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data[item.apiKey]}
		</li>
	)
}

const orderCon3 = (data, item, key, props) => {
	return (
		<li className={'left textoverflow1'} style={item.style}>
			{data[item.apiKey]}
		</li>
	)
}

const orderCon4 = (data, item, key, props) => {
	return (
		<li className={'left flex tb-flex lr-flex'} style={item.style}>
			<img src={`/static/icons/modify.png`} style={{height: '.16rem'}} onClick={() => props.clickShowModal(data, 'modify')} />
			{/* <img src={`/static/icons/delete.png`} style={{height: '.16rem', padding: `0 ${theme.tbmargin}`}} onClick={() => props.clickShowModal(data, 'delete')} /> */}
		</li>)
}

