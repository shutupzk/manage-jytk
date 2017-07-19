import React, { Component } from 'react'
import Router from 'next/router'
import {theme} from 'components'
import {ORDERTYPE} from 'config'
import OrderItemDoctor from './order_item_doctor'

export default class OrderListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
	}
	

  showPayMethod(method) {
		console.log('----method', method)
    let html;
    const aliPay = '/static/icons/aliPay.png'
    const wxPay = '/static/icons/wxPay.png'
    const yinlianPay = '/static/icons/yinlianPay.png'
    if (method === 'WECHAT') {
      html = (<p className='flex tb-flex'><img height='14px' src={wxPay} alt="" />&nbsp;微信支付</p>)
    } else if (method === 'ALIPAY') {
      html = (<p className='flex tb-flex'><img height='14px' src={aliPay} alt="" />&nbsp;支付宝支付</p>)
    } else if (method === 'NATIVE') {
      html = (<p className='flex tb-flex'><img height='14px' src={yinlianPay} alt="" />&nbsp;银联支付</p>)
    }
    return html;
	}
	

  render () {
		const data = this.props.data || {}
		const curStatus = ORDERTYPE.filter((item) => item.value === data.status) || []
    return (
			<div className={'orderRecordItem'}>
        <header>
          {/*<input type="checkbox" className="left" style={{marginRight: '10px',background: 'transparent',margin: 0}} />*/}
          <p className="left">{data.createdAt|| '无'}</p>
          <p className="left" style={{color: theme.fontcolor,padding: '0 10px'}}>订单编号 {data.id|| '无'}</p>
          {/*<p className="left">距离关闭还有&nbsp;<i style={{color: #FF8A00,font-style: normal}}>00:28:06</i></p>*/}
					<article className='clearfix'></article>
        </header>
        <ul className='flex tb-flex'>
          <OrderItemDoctor data={data} />
          <li className={'left ' + 'orderCon2'}>
            ￥{data.fee|| '无'}
          </li>
          <li className={'left ' + 'orderCon3'}>
            {data.count|| '1'}
          </li>
          <li className={'left ' + 'orderCon4'}>
            <p>{data.patient.name|| '无'}</p>
            <p>{data.patient.phone|| '无'}</p>
          </li>
          <li className={'left ' + 'orderCon5'} style={{paddingTop: data.refundFlag ? '0' : '10px'}}>
            <p>{curStatus[0] && curStatus[0].title || '无'}</p>
            <article style={{display: data.payment ? 'block' : 'none'}}>退款</article>
            <article onClick={() => {Router.push(`/order/detail?id=${data.id}`)}}>查看详情</article>
          </li>
					{
						data.payment ?
							<li className={'left ' + 'orderCon6'}>
								<p style={{color: theme.nfontcolor}}>实付&nbsp;<strong style={{color: '#FF8A00'}}>￥{data.payment.totalFee|| '无'}</strong></p>
								<p>{data.payment.createdAt|| '无'}</p>
								{this.showPayMethod(data.payment.payWay)}
							</li>
						:
						<li className={'left ' + 'orderCon6'}>
							<p>{'无'}</p>
						</li>
					}
					<article className='clearfix'></article>
        </ul>
				<style jsx>{`
					.orderRecordItem{
						border: 1px solid #E6E6E6;
						border-radius: 3px;
						margin: 10px 0;
						background: #fff;
					}
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
					.orderCon2, .orderCon3{
						color: #505050;
						line-height: 54px;
						width: 10%
					}
					.orderCon4{
						color: #505050;
						width: 14%
					}
					.orderCon5{
						color: #505050;
						padding-top: 10px;
						width: 16%
					}
					.orderCon5 article{
						color: #3464CA;
						display: block;
						cursor: pointer;
					}
					.orderCon5AddBtn{
						padding-top: 0;
					}
					.orderCon6{
						color: #797979;
						width: 20%
					}
					.orderCon6 p:nth-of-type(3) {
							line-height: 16px;
					}
				`}</style>
      </div>
    )
  }
}