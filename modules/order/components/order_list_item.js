import React, { Component } from 'react'
import Router from 'next/router'
import {theme} from 'components'
import {ORDERINFO} from 'config'
import OrderItemDoctor from './order_item_doctor'
import moment from 'moment'

export default class OrderListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
	}

  render () {
		const data = this.props.data || {}
		const props = this.props
		const curDate = new Date() // 当前时间
		const overDate = moment(data.createdAt).add(4, 'h') // 开始时间+24=计划结束时间
		const diffSeconds = ((new Date(overDate).getTime()) - (curDate.getTime()))/1000
    return (
			<div key={data.id} style={{border: `1px solid ${theme.nbordercolor}`,borderRadius: 3, margin: `${theme.tbmargin} 0px`, background: '#fff', color: theme.mainfontcolor}}>
				<header style={{background: '#E8EEFA', lineHeight: '.24rem', padding: `${theme.midmargin} ${theme.lrmargin}`, fontSize: '.12rem'}}>
          {/* <input type="checkbox" id='orderId' className="left" style={{background: 'transparent',margin: '.06rem .06rem 0 0'}} /> */}
          <p className="left">{moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
          <p className="left" style={{color: theme.fontcolor,padding: '0 10px'}}>订单编号 {data.consultationNo|| '无'}</p>
					{/* {
						data.status === '03' ?
							diffSeconds < 7200 && diffSeconds > 0 ?
          			<p className="left">距离关闭还有{SetTimeCard(diffSeconds, this)}</p>
							: ''
						: ''
					} */}
					<article className='clearfix'></article>
        </header>
        <ul className='flex tb-flex listItem' style={{lineHeight: '20px', fontSize: 12, padding: `${theme.tbmargin} ${theme.lrmargin}`}}>
					{
						ORDERINFO.order_list_title.map((item, iKey) => {
							const orderCon = `orderCon${iKey}`
							return eval(orderCon + '(item, props, iKey)')
						})
					}
					<article className='clearfix'></article>
        </ul>
      </div>
    )
  }
}
// let timer
// const SetTimeCard = (diffSeconds, self) => {
// 	let difftimer = diffSeconds
// 	timer = setInterval(() => {
// 		difftimer = difftimer - 1
// 		const hours = parseInt(difftimer / 3600)
// 		const minute = parseInt((difftimer - (hours*60))/60)
// 		const second = parseInt(difftimer - (hours*60) - minute*60)
// 		document.getElementById('timerText').value=hours
// 		// if(self.refs.timerText) {self.refs.timerText.value = hours}
// 	}, 1000);
// 	return (
// 		<span style={{color: '#FF8A00'}} id='timerText'></span>
// 	)
// }
// class SetTimeCard extends Component {
// 	constructor (props) {
//     super(props)
//     this.state = {
// 			timeText: props.diffTime
//     }
// 	}

// 	componentDidMount() {
// 		if (this.props.diffSeconds >= 0) {
//       // this.setState({show: true});
//       // clearTimeout(timer);
//       timer = setInterval(() => {
// 				console.log('-----componentDidMount====', this.state.timeText)
// 				const prevTime = this.state.timeText
//         this.setState({timeText: prevTime - 1});
//       }, 5000);
//     }
// 	}

// 	render() {
// 		return (
// 			<span style={{color: '#FF8A00'}}>{moment(this.state.timeText).format('YYYY-MM-DD HH:mm:ss')}</span>
// 		)
// 	}
// }

const orderCon0 = (item, props, iKey) => {
	return (
		<OrderItemDoctor data={props.data} key={iKey} />
	)
}

const normalHtml = (item, data, iKey, style, type) => {
	style.color = theme.mainfontcolor
	return (
		<li className={'left'} key={iKey} style={style}>
			<span style={{display: 'inline-block'}}>{type === 'fee' ? '￥' : 'x'}</span>{data|| '无'}
		</li>
	)
}

const orderCon1 = (item, props, iKey) => {
	return (normalHtml(item, props.data && props.data.fee, iKey, Object.assign({}, item.style, {lineHeight: '.54rem'}), 'fee'))
}

const orderCon2 = (item, props, iKey) => {
	// item.style.lineHeight = '.54rem'
	return (normalHtml(item, props.data && props.data.count || '1', iKey, Object.assign({}, item.style, {lineHeight: '.54rem'}), 'count'))
}

const orderCon3 = (item, props, iKey) => {
	item.style.color = theme.mainfontcolor
	return (
		<li className={'left'} key={iKey} style={item.style}>
			<p>{props.data && props.data.patient && props.data.patient.user && props.data.patient.user.name || '无'}</p>
			<p>{props.data && props.data.patient && props.data.patient.user && props.data.patient.user.phone|| '无'}</p>
		</li>
	)
}

const orderCon4 = (item, props, iKey) => {
	item.style.color = theme.mainfontcolor
	const curStatus = ORDERINFO.order_type.filter((item) => {return item.value === props.data.status}) || []
	return (
		<li className={'left'} key={iKey} style={item.style}>
			<p style={{fontSize: 12}}>{curStatus[0] && curStatus[0].title || '无'}</p>
			<article style={{display: (curStatus[0] && curStatus[0].isRefound) ? 'block' : 'none', lineHeight: '18px'}} onClick={() => props.clickConfirm(props.data, 'cancel')}>退款</article>
			<article style={{lineHeight: '16px'}} onClick={() => {Router.push(`/order/detail?id=${props.data && props.data.id}`)}}>查看详情</article>
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

const orderCon5 = (item, props, iKey) => {
	const data = props.data || {}
	item.style.color = theme.mainfontcolor
	let payway = {title: '', imgurl: ''}
	if (data.payment && data.payment.payWay === 'WECHAT') {
		payway = {title: '微信支付', imgurl: 'wxPay'}
	} else if (data.payment && data.payment.payWay === 'ALIPAY') {
		payway = {title: '支付宝支付', imgurl: 'aliPay'}
	} else if (data.payment && data.payment.payWay === 'NATIVE') {
		payway = {title: '微信支付', imgurl: 'wxPay'}
	} 
	let html
	if (data.status === '01' || !data.payment) {
		html = <li className={'left'} key={iKey} style={item.style}>
				<p>{'无'}</p>
			</li>
	} else {
		html = <li className={'left'} key={iKey} style={item.style}>
					<p style={{color: theme.nfontcolor}}><span style={{fontSize: 12}}>实付&nbsp;</span><strong style={{color: '#FF8A00'}}>￥{data.payment && data.payment.totalFee|| '无'}</strong></p>
					<p style={{lineHeight: '18px'}}>{moment(data.payTime).format('YYYY-MM-DD HH:mm:ss')}</p>
					<p className='flex tb-flex lr-flex' style={{lineHeight: '.16rem'}}>
						<img height='14px' src={`/static/icons/${payway.imgurl}.png`} alt="" />&nbsp;{payway.title}
					</p>
				</li>
	}
	return html
}