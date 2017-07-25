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
		const props = this.props || {}
		const {titleInfo} = this.props
		let newTitleInfo = titleInfo.filter((item) => item.nolistShow !== true)
    return (
			<ul className='flex tb-flex'>
				{
					newTitleInfo.map((item, iKey) => {
						const orderCon = `orderCon${iKey}`
						return eval(orderCon + '(props, item, iKey)')
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
			{data|| '无'}
		</li>
	)
}

const orderCon0 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderCon1 = (props, item, iKey) => {
	return (normalHtml(props.data.newsGroup && props.data.newsGroup.type, item, iKey))
}

const orderCon2 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderCon3 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderCon4 = (props, item, iKey) => {
	return (
		<li className={'left flex tb-flex lr-flex'} key={iKey} style={item.style}>
			<img src={`/static/icons/modify.png`} style={{height: '.16rem'}} onClick={() => props.clickShowModal(props.data, 'modify')} />
			{/* <img src={`/static/icons/delete.png`} style={{height: '.16rem', padding: `0 ${theme.tbmargin}`}} onClick={() => props.clickShowModal(data, 'delete')} /> */}
		</li>)
}

