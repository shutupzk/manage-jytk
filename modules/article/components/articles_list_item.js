import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import {theme} from 'components'

export default class ArticleListItem extends Component {
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
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderCon1 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderCon2 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderCon3 = (props, item, iKey) => {
	return (btnHtml(props, item, iKey))
}

const btnHtml = (props, item, iKey) => {
	return (
		<li className={'left flex tb-flex lr-flex'} key={iKey} style={item.style}>
			<img src={`/static/icons/modify.png`} style={{height: '.16rem'}} onClick={() => props.clickShowModal(props.data, 'modify')} />
			<img src={`/static/icons/delete.png`} style={{height: '.16rem', display: item.showDelete ? 'block' : 'none', padding: `0 ${theme.tbmargin}`}} onClick={() => props.clickShowModal(props.data, 'delete')} /> 
		</li>)
}

const orderCon5 = (props, item, iKey) => {
	return (btnHtml(props, item, iKey))
}

