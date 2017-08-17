import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import Link from 'next/link'
import {theme, Prompt, Loading} from 'components'
import {ORDERINFO, HOSPITALINFO} from 'config'
import {OrderTab, OrderListTopFilterCard, OrderListTitle, OrderListItem, OrderItemDoctor} from '../components'
import { queryOrderDetail } from '../../../ducks'
import { connect } from 'react-redux'
import {ages, sex} from 'utils'
import moment from 'moment'


class OrderRecordDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: '', // 空 代表全部
      keyword: ''
    }
  }

  componentWillMount() {
    const {id} = this.props.url && this.props.url.query || {}
    this.props.queryOrderDetail(this.props.client, {id})
  }

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		const orderDetail = this.props.orderDetail || {};
    return (
      <div>
				{topView()}
				{statusView(orderDetail)}
				{userInfoView(orderDetail)}
				{productInfoView(orderDetail)}
				{productDetailView(orderDetail)}
      </div>
    )
  }
}

const topView = () => {
	return (
		<header className='topView' style={{color: theme.mainfontcolor, fontSize: theme.nfontsize}}>
			{/* <span className="left">首页</span>
			<span className="left">&nbsp;>&nbsp;</span> */}
			<Link href='/order'><a className="left">订单管理</a></Link>
			<span className="left">&nbsp;>&nbsp;</span>
			<span className="left">订单详情</span>
			<article className="right" style={{color: theme.fontcolor, fontSize: theme.nfontsize}}>订单管理答疑QA</article>
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

const statusView = (data) => {
	let curStatus = ORDERINFO.order_type.filter((item) => item.value === data.status) || []
	let imgUrl = 'ordering'
	if (data.status === '07' || data.status === '08') {
		imgUrl = 'pass'
	}
	return (
		<div className='flex tb-flex' style={{minHeight: '.7rem', margin: '.2rem .3rem .1rem', border: `1px solid ${theme.maincolor}`, borderRadius: 3, color: theme.maincolor}}>
			<img src={`/static/${HOSPITALINFO.hospital_short_name}/${imgUrl}.png`} style={{margin: '0 .1rem 0 .3rem', height: '.2rem'}} />
			<h3>当前状态：{curStatus[0] && curStatus[0].title || '无'}</h3>
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
						<dd>姓名：{orderDetail.patient && orderDetail.patient.user.name || '无'}&nbsp;&nbsp;&nbsp;&nbsp;手机号：{orderDetail.patient && orderDetail.patient.user.phone || '无'}</dd>
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
					数量*{orderDetail.count || '1'}
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
				<i className="left" style={{fontSize: '.16rem', color: '#FF8A00'}}>￥{orderDetail.status === '01' ? '0' : orderDetail.payment && orderDetail.payment.totalFee || '未知'}</i>
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

const productDetailView = (orderDetail) => {
	return (
		<div style={{padding: '0 .3rem .6rem',fontSize: theme.mainfontsize,color: theme.mainfontcolor,}}>
			<header style={{lineHeight: '.34rem', fontWeight: 500,textIndent: 10}}>订单信息</header>
			<p style={{lineHeight: '.3rem', margin: '.06rem 0 .04rem .46rem'}}>订单编号 {orderDetail.consultationNo}</p>
			<ul style={{borderLeft: `1px solid ${theme.nbordercolor}`, marginLeft: '.3rem'}}>
				<li><i></i>下单时间 {moment(orderDetail.createdAt).format('YYYY-MM-DD HH:mm:ss')}</li>
				{
					orderDetail.payment ?
						<li>
							<i></i><p style={{lineHeight: '.3rem'}}>支付时间 {moment(orderDetail.payment.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
							<p style={{color: theme.fontcolor, fontSize: 12, lineHeight: '14px'}}>&nbsp;&nbsp;支付流水号&nbsp;{orderDetail.payment.transactionNo}</p></li>
					: ''
				}
				{/* {orderDetail. ? <li><i></i>申请退款时间 {orderDetail.refundTime}</li> : <strong></strong>} */}
			</ul>
			<style jsx>{`
				li{
					color: ${theme.mainfontcolor};
					font-size: .13rem
					line-height: .3rem
					margin: 0;
					padding-left: .16rem
					position: relative;
				}
				i{
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

function mapStateToProps (state) {
  return {
    orderDetail: state.order.data,
    loading: state.order.loading,
    error: state.order.error
  }
}

export default connect(mapStateToProps, { queryOrderDetail })(OrderRecordDetailScreen)
