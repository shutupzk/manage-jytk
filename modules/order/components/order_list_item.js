import React, { Component } from 'react'
import Router from 'next/router'
import {theme} from 'components'
import {ORDERTYPE, ORDERINFO} from 'config'
import OrderItemDoctor from './order_item_doctor'

export default class OrderListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
	}

  render () {
		const data = this.props.data || {}
    return (
			<div style={{border: `1px solid ${theme.nbordercolor}`,borderRadius: 3, margin: `${theme.tbmargin} 0px`, background: '#fff', color: theme.mainfontcolor}}>
        <header style={{background: '#E8EEFA', lineHeight: '.24rem', padding: `${theme.midmargin} ${theme.lrmargin}`, fontSize: '.12rem'}}>
          {/*<input type="checkbox" className="left" style={{marginRight: '10px',background: 'transparent',margin: 0}} />*/}
          <p className="left">{data.createdAt|| '无'}</p>
          <p className="left" style={{color: theme.fontcolor,padding: '0 10px'}}>订单编号 {data.id|| '无'}</p>
          {/*<p className="left">距离关闭还有&nbsp;<i style={{color: #FF8A00,font-style: normal}}>00:28:06</i></p>*/}
					<article className='clearfix'></article>
        </header>
        <ul className='flex tb-flex'>
					{
						ORDERINFO.order_list_title.map((item, iKey) => {
							const orderCon = `orderCon${iKey}`
							return eval(orderCon + '(data, item)')
						})
					}
					<article className='clearfix'></article>
        </ul>
				<style jsx>{`
					header{
						background: #E8EEFA;
						line-height: 24px;
						padding: 6px 15px;
						font-size: 12px;
						color: #505050;
					}
					ul{
						padding: 10px 15px 14px;
						color: #797979;
						height: 54px;
						font-size: 13px;
						box-sizing: content-box;
					}
				`}</style>
      </div>
    )
  }
}

const orderCon0 = (data) => {
	return (
		<OrderItemDoctor data={data} />
	)
}

const orderCon1 = (data, item) => {
	let style = item.style
	style.color = theme.mainfontcolor
	style.lineHeight = '.54rem'
	return (
		<li className={'left'} style={style}>
			￥{data.fee|| '无'}
		</li>
	)
}

const orderCon2 = (data, item) => {
	item.style.color = theme.mainfontcolor
	item.style.lineHeight = '.54rem'
	return (
		<li className={'left'} style={item.style}>
			{data.count|| '1'}
		</li>
	)
}

const orderCon3 = (data, item) => {
	item.style.color = theme.mainfontcolor
	return (
		<li className={'left'} style={item.style}>
			<p>{data.patient && data.patient.user && data.patient.user.name|| '无'}</p>
			<p>{data.patient && data.patient.user && data.patient.user.phone|| '无'}</p>
		</li>
	)
}

const orderCon4 = (data, item) => {
	item.style.color = theme.mainfontcolor
	const curStatus = ORDERTYPE.filter((item) => item.value === data.status) || []
	return (
		<li className={'left'} style={item.style}>
			<p>{curStatus[0] && curStatus[0].title || '无'}</p>
			<article style={{display: data.payment ? 'block' : 'none'}}>退款</article>
			<article onClick={() => {Router.push(`/order/detail?id=${data.id}`)}}>查看详情</article>
			<style jsx>{`
				article{
					color: #3464CA;
					display: block;
					cursor: pointer;
				}
			`}</style>
		</li>
	)
}

const orderCon5 = (data, item) => {
	item.style.color = theme.mainfontcolor
	let payway = {title: '', imgurl: ''}
	if (data.payment && data.payment.payWay === 'WECHAT') {
		payway = {title: '微信支付', imgurl: 'wxPay'}
	} else if (data.payment && data.payment.payWay === 'ALIPAY') {
		payway = {title: '支付宝支付', imgurl: 'aliPay'}
	} else if (data.payment && data.payment.payWay === 'NATIVE') {
		payway = {title: '银联支付', imgurl: 'yinlianPay'}
	} 
	let html = <li className={'left'} style={item.style}>
				<p>{'无'}</p>
			</li>
	if (data.payment) {
		html = <li className={'left'} style={item.style}>
					<p style={{color: theme.nfontcolor}}><span style={{fontSize: 12}}>实付&nbsp;</span><strong style={{color: '#FF8A00'}}>￥{data.payment && data.payment.totalFee|| '无'}</strong></p>
					<p style={{lineHeight: '18px'}}>{data.payment.createdAt|| '无'}</p>
					<p className='flex tb-flex lr-flex' style={{lineHeight: '.16rem'}}>
						<img height='14px' src={`/static/icons/${payway.imgurl}.png`} alt="" />&nbsp;{payway.title}
					</p>
				</li>
	}
	return html
}