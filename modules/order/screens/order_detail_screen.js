import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import Link from 'next/link'
import {theme, Prompt, Loading} from 'components'
import {ORDERINFO, HOSPITALINFO} from 'config'
import {OrderTab, OrderTipModal, OrderItemDoctor} from '../components'
import { queryOrderDetail, updateConsultation, showPrompt } from '../../../ducks'
import { connect } from 'react-redux'
import {ages, sex} from 'utils'
import moment from 'moment'


class OrderRecordDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  componentWillMount() {
    const {id} = this.props.url && this.props.url.query || {}
    this.props.queryOrderDetail(this.props.client, {id})
  }

	async clickModalOk(reason, refundRemark) {
		const {id} = this.props.url && this.props.url.query || {}
		let error = await this.props.updateConsultation(this.props.client, {id: id, status: '10', refundReason: reason, refundRemark: refundRemark})
		if (error) {
			this.props.showPrompt({text: error})
			return
    }
		this.setState({showModal: false})
    this.props.showPrompt({text: '退款成功'})
		this.props.queryOrderDetail(this.props.client, {id})
	}
	
	filterOpationTime(status) {
		const orderDetail = this.props.orderDetail || {};
		let statusTime = orderDetail.consultationOperations && orderDetail.consultationOperations.filter((item) => {return item.operationCode === status}) || []
		if (statusTime.length === 0) {
			return ''
		}
		return moment(statusTime && statusTime[0] && statusTime[0].operationTime).format('YYYY-MM-DD HH:mm:ss')
	}

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		const orderDetail = this.props.orderDetail || {};
    return (
      <div>
				{topView()}
				{renderModal(this, orderDetail)}
				{statusView(this, orderDetail)}
				{userInfoView(orderDetail)}
				{productInfoView(orderDetail)}
				{productDetailView(this, orderDetail)}
      </div>
    )
  }
}

const renderModal = (self, data) => {
  const {showModal} = self.state;
	return (
		<OrderTipModal showModalState={showModal}
			selectOrder={data}
			onHide={() => self.setState({showModal: false})}
			clickModalOk={(refundReason, refundRemark) => self.clickModalOk(refundReason, refundRemark)}>
		</OrderTipModal>
	)
}


const topView = () => {
	return (
		<header className='topView' style={{color: theme.mainfontcolor, fontSize: theme.nfontsize}}>
			{/* <span className="left">首页</span>
			<span className="left">&nbsp;>&nbsp;</span> */}
			<Link href='/order'><a className="left">订单管理</a></Link>
			<span className="left">&nbsp;>&nbsp;</span>
			<span className="left">订单详情</span>
			<span style={{float: 'right', fontSize: 12, lineHeight: '30px', cursor: 'pointer'}} onClick={() => Router.push('/order/order_help?id=')}>问题和帮助QA</span> 
			<p className='clearfix'></p>
			<style>{`
				.topView a{
					color: ${theme.mainfontcolor}
				}
				.topView a:hover{
					text-decoration: underline;
				}	
			`}</style>
		</header>
	)
}

const statusView = (self, data) => {
	let curStatus = ORDERINFO.order_type.filter((item) => item.value === data.status) || []
	let imgUrl = 'pass'
	if (data.status === '01' || data.status === '03' || data.status === '04') {
		imgUrl = 'ordering'
	} else if (data.status === '05') {
		imgUrl = 'ordercancel'
	}
	return (
		<div className='flex tb-flex' style={{minHeight: '.7rem', margin: '.2rem .3rem .1rem', border: `1px solid ${theme.maincolor}`, borderRadius: 3, color: theme.maincolor}}>
			<img src={`/static/${HOSPITALINFO.hospital_short_name}/${imgUrl}.png`} style={{margin: '0 .1rem 0 .3rem', height: '.2rem'}} />
			<h3>当前状态：{curStatus[0] && curStatus[0].title || '无'}</h3>
			{curStatus[0] && curStatus[0].isRefound ?
				<button className='btnBGGray' style={{marginLeft: theme.tbmargin, width: 100, border: `1px solid ${theme.bordercolor}`}} onClick={() => {self.setState({showModal: true})}}>退款</button> : ''}
		</div>
	)
}

const userInfoView = (orderDetail) => {
	return (
		<div className={'userInfo'}>
			<header>用户信息</header>
			<section className='flex' style={{padding: '0 .3rem'}}>
				<img src={orderDetail.patient && orderDetail.patient.user.avatar || '/static/icons/doctor.png'} style={{width: '.5rem', height: '.5rem', paddingTop: '.15rem'}} />
				<div>
					<dl>
						<dt>买家信息</dt>
						<dd>姓名：{orderDetail.patient && orderDetail.patient.user && orderDetail.patient.user.name || '无'}&nbsp;&nbsp;&nbsp;&nbsp;手机号：{orderDetail.patient && orderDetail.patient.user && orderDetail.patient.user.phone || '无'}</dd>
					</dl>
					<dl>
						<dt>就诊人信息</dt>
						<dd>姓名：{orderDetail.patient && orderDetail.patient.name || '无'}&nbsp;&nbsp;性别：{sex(orderDetail.patient && orderDetail.patient.sex) || '无'}&nbsp;&nbsp;年龄：{ages(orderDetail.patient && orderDetail.patient.birthday) || '无'}岁</dd> 
					</dl>
				</div>
			</section>
			<style jsx>{`
				.userInfo{
					background: #FFFFFF;
					border: 1px solid #E6E6E6;
					border-radius: 4px;
					margin: 15px .3rem
				}
				header{
					background: #E8EEFA;
					line-height: 34px;
					font-size: 15px;
					color: ${theme.mainfontcolor};
					font-weight: 500;
					text-indent: 10px;
				}
				dl{
					font-size: 13px;
					color: #797979;
					margin: 15px .1rem
				}
				dt{
					color: ${theme.mainfontcolor};
					margin-bottom: 6px;
				}
			`}</style>
		</div>
	)
}

const productInfoView = (orderDetail) => {
	return (
		<div className={'productInfo'}>
			<header>产品服务信息</header>
			<ul>
				<OrderItemDoctor data={orderDetail} />
				<li className={'left'} style={{lineHeight: '.56rem'}}>
					单价￥{orderDetail.fee || '无'}
				</li>
				<li className={'left'} style={{lineHeight: '.56rem'}}>
					数量x{orderDetail.count || '1'}
				</li>
				<p className='clearfix'></p>
			</ul>
			<article style={{marginTop: theme.lrmargin, marginLeft: '.3rem'}}><p>
				<span className="left">积分：</span>
				<i className="left">0</i>
				<strong className='clearfix'></strong>
			</p></article>
			<article style={{marginLeft: '.3rem'}}><p className="">
				<span className="left">优惠：</span>
				<i className="left">0</i>
				<strong className='clearfix'></strong>
			</p></article>
			<article style={{marginTop: theme.tbmargin,paddingBottom: theme.lrmargin,marginLeft: '.3rem'}}><p className="">
				<span className="left">实付款：</span>
				<i className="left" style={{fontSize: '.16rem', color: '#FF8A00'}}>{orderDetail.status === '01' || orderDetail.status === '02' ? '' : `￥${orderDetail.payment && orderDetail.payment.totalFee}`}</i>
				<strong className='clearfix'></strong>
			</p></article>
			<style jsx>{`
				i{
					font-style: normal;
				}
				.productInfo{
					background: #FFFFFF;
					border: 1px solid #E6E6E6;
					border-radius: 4px;
					margin: 15px .3rem
				}
				header{
					background: #E8EEFA;
					line-height: 34px;
					font-size: 15px;
					color: ${theme.mainfontcolor};
					font-weight: 500;
					text-indent: 10px;
				}
				ul{
					border-bottom: 1px solid #E6E6E6;
					padding: 14px .3rem
				}
				li{
					width: 30%;
					color: ${theme.fontcolor};
					font-size: ${theme.nfontsize};
				}
				article{
					margin: 0;
				}
				article	p{
					width: 30%;
					margin-left: .3rem
					font-size: .12rem
					color: ${theme.mainfontcolor};
				}
			`}</style>
		</div>
	)
}

const productDetailView = (self, orderDetail) => {
	return (
		<div style={{padding: '0 .3rem .6rem',fontSize: theme.mainfontsize,color: theme.mainfontcolor,}}>
			<header style={{lineHeight: '.34rem', fontWeight: 500,textIndent: 10}}>订单信息</header>
			<p style={{lineHeight: '.3rem', margin: '.06rem 0 .04rem .46rem'}}>订单编号 {orderDetail.consultationNo}</p>
			<ul className='opeartionItem' style={{borderLeft: `1px solid ${theme.nbordercolor}`, marginLeft: '.3rem'}}>
				{detailOpationHtml(self, orderDetail)}
			</ul>
			<style jsx global>{`
				ul.opeartionItem li{
					color: ${theme.mainfontcolor};
					font-size: .13rem
					line-height: .3rem
					margin: 0;
					padding-left: .16rem
					position: relative;
				}
				ul.opeartionItem i{
					width: .08rem;
					height: .08rem;
					background: ${theme.bordercolor};
					border-radius: 50%;
					position: absolute;
					top: .12rem
					left: -.04rem;
				}
			`}</style>
		</div>
	)
}

const detailOpationHtml = (self, orderDetail) => {
	if (orderDetail.status === '01') {
		return (status1Html(self))
	}
	if (orderDetail.status === '02') {
		return (
			<div>
				{status1Html(self)}
				<li><i></i>取消时间：{self.filterOpationTime('02')}</li>
			</div>
		)
	}
	if (orderDetail.status === '03') {
		return (
			<div>
				{status1Html(self)}
				{status3Html(self, orderDetail)}
			</div>
		)
	}
	if (orderDetail.status === '04') {
		return (
			<div>
				{status1Html(self)}
				{status3Html(self, orderDetail)}
				{status4Html(self)}
			</div>
		)
	}
	if (orderDetail.status === '05') {
		return (
			<div>
				{status1Html(self)}
				{status3Html(self, orderDetail)}
				{status5Html(self)}
			</div>
		)
	}
	if (orderDetail.status === '07') {
		return (
			<div>
				{status1Html(self)}
				{status3Html(self, orderDetail)}
				{status4Html(self)}
				{status7Html(self)}
			</div>
		)
	}
	if (orderDetail.status === '08') {
		return (
			<div>
				{status1Html(self)}
				{status3Html(self, orderDetail)}
				{status5Html(self)}
				{refoundHtml(self, orderDetail)}
			</div>
		)
	}
	if (orderDetail.status === '06' || orderDetail.status === '09') {
		return (
			<div>
				{status1Html(self)}
				{status3Html(self, orderDetail)}
				{status6Html(self, orderDetail)}
				{refoundHtml(self, orderDetail)}
			</div>
		)
	}
	if (orderDetail.status === '10') {
		return (
			<div>
				{status1Html(self)}
				{status3Html(self, orderDetail)}
				{status4Html(self)}
				{status7Html(self)}
				{refoundHtml(self, orderDetail)}
			</div>
		)
	}
}

const refoundHtml = (self, orderDetail) => {
	return (
		<li>
			<i></i><p style={{lineHeight: '.3rem', fontSize: 13}}>退款时间： {self.filterOpationTime('06')}</p>
			<p style={{display: orderDetail.operationPeople ? 'block' : 'none'}}><span style={{padding: '0 .02rem 0 .06rem'}}>退款操作员</span>{orderDetail.operationPeople}</p>
			<p style={{display: orderDetail.fee ? 'block' : 'none'}}><span style={{padding: '0 .02rem 0 .06rem'}}>退款金额</span>{orderDetail.fee}元</p>
			<p style={{display: orderDetail.refundReason ? 'block' : 'none'}}><span style={{padding: '0 .02rem 0 .06rem'}}>退款原因</span>{orderDetail.refundReason}</p>
			<p style={{display: orderDetail.refundRemark ? 'block' : 'none'}}><span style={{padding: '0 .02rem 0 .06rem'}}>备注信息</span>{orderDetail.refundRemark}</p>
			<style jsx>{`
				p{
					color: ${theme.fontcolor};
					font-size: 12px;
					line-height: 14px;
					margin-bottom: ${theme.midmargin};
				}
			`}</style>
		</li>
	)
}

const status1Html = (self) => {
	const time = self.filterOpationTime('01')
	return (
		<li><i></i>下单时间：{time}</li>
	)
}

const status3Html = (self, orderDetail) => {
	const time = self.filterOpationTime('03')
	return (
		<li style={{display: time ? 'block' : 'none'}}>
			<i></i><p style={{lineHeight: '.3rem', fontSize: 13}}>支付时间 {time}</p>
			<p style={{color: theme.fontcolor, fontSize: 12, lineHeight: '14px', marginBottom: theme.midmargin}}><span style={{padding: '0 .02rem 0 .06rem'}}>支付流水号</span>{orderDetail.payment && orderDetail.payment.transactionNo}</p>
		</li>
	)
}

const status4Html = (self, orderDetail) => {
	const time = self.filterOpationTime('04')
	return (
		<li style={{display: time ? 'block' : 'none'}}><i></i>开始时间：{time}</li>
	)
}

const status5Html = (self, orderDetail) => {
	const time = self.filterOpationTime('05')
	return (
		<li style={{display: time ? 'block' : 'none'}}><i></i>过期时间：{time}</li>
	)
}

const status6Html = (self, orderDetail) => {
	const time = self.filterOpationTime('06')
	return (
		<li style={{display: time ? 'block' : 'none'}}><i></i>买家申请退款时间：{time}</li>
	)
}

const status7Html = (self, orderDetail) => {
	const time = self.filterOpationTime('07')
	return (
		<li style={{display: time ? 'block' : 'none'}}><i></i>结束时间：{time}</li>
	)
}

function mapStateToProps (state) {
  return {
    orderDetail: state.order.data,
    loading: state.order.loading,
    error: state.order.error
  }
}

export default connect(mapStateToProps, { queryOrderDetail, updateConsultation, showPrompt })(OrderRecordDetailScreen)
