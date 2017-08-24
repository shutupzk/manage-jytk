import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import {theme} from 'components'
import { queryDoctors, showPrompt, updateDoctor } from '../../../ducks'
import { connect } from 'react-redux'
import {ORDERINFO, DOCTORINFO, HOSPITALINFO} from 'config'

class ManageListItem extends Component {
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
			<ul className='flex tb-flex listItem'>
				{
					newTitleInfo.map((item, iKey) => {
						const orderCon = `orderCon${iKey}`
						return eval(orderCon + '(props, item, iKey, key)')
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
			{data || '无'}
		</li>
	)
}

const orderCon0 = (props, item, iKey, key) => {
	return (
		<li style={item.style} key={iKey}>{key + 1}</li>
	)
}

const orderCon1 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderCon2 = (props, item, iKey) => {
	return (normalHtml(props.data[item.apiKey], item, iKey))
}

const orderCon3 = (props, item, iKey) => {
	const data = props.data || {}
	return (normalHtml(data.departmentHasDoctors &&
			data.departmentHasDoctors[0] &&
			data.departmentHasDoctors[0].department &&
			data.departmentHasDoctors[0].department.hospital &&
			data.departmentHasDoctors[0].department.hospital.hospitalName, item, iKey))
}

const orderCon4 = (props, item, iKey) => {
	const curStatus = ORDERINFO && ORDERINFO.order_type && ORDERINFO.order_type.filter((item) => item.value === props.data.status) || []
	const data = props.data || {}
	return (normalHtml(data.departmentHasDoctors &&
			data.departmentHasDoctors[0] &&
			data.departmentHasDoctors[0].department &&
			data.departmentHasDoctors[0].department.deptName, item, iKey))
}

const btnHtml = (props, item, iKey) => {
	return (<li className={'left textoverflow1'} key={iKey} style={item.style}>
		{
			DOCTORINFO.modal_type_title && DOCTORINFO.modal_type_title[1] ?
				props.data.showInternet ?
					<span style={{color: theme.maincolor, cursor: 'pointer'}} onClick={() => props.clickShowModal(props.data, 'modify')}>{'设置'}</span>
				:
					<span style={{color: theme.nfontcolor}}>{'设置'}</span>
			:
				<span style={{color: theme.maincolor, cursor: 'pointer'}} onClick={() => props.clickShowModal(props.data, 'modify')}>{'设置'}</span>
		}
	</li>)
}

const orderCon5 = (props, item, iKey) => {
	const data = props.data || {}
	if (item.title.indexOf('设置') > -1) {
		return(btnHtml(props, item, iKey))
	}
	if (item.title.indexOf('亚专业') > -1) {
		return (normalHtml(data.departmentHasDoctors &&
			data.departmentHasDoctors[0] &&
			data.departmentHasDoctors[0].department &&
			data.departmentHasDoctors[0].department.childs &&
			data.departmentHasDoctors[0].department.childs[0] &&
			data.departmentHasDoctors[0].department.childs[0].deptName, item, iKey))
	}
	return (
		<li className={'left textoverflow1'} key={iKey} style={item.style}>
			<article className='checkboxRow'>
				{
					props.data.showInternet ?
						<input style={{display: 'none'}}
							onClick={(e) => props.changeShowInternet(props.data, e)}
							checked type='checkbox'
							id={`showInternet${props.data.id}`} ref={`${item.apiKey}Ref`} />
					:
						<input style={{display: 'none'}}
							checked={false}
							onClick={(e) => props.changeShowInternet(props.data, e)}
						 type='checkbox'
						id={`showInternet${props.data.id}`} ref={`${item.apiKey}Ref`} />
				}
				<label style={{top: '8px'}} htmlFor={`showInternet${props.data.id}`}>开启</label>
				<label style={{top: '8px'}} htmlFor={`showInternet${props.data.id}`}>关闭</label>
			</article>
		</li>
	)
}

const orderCon6 = (props, item, iKey) => {
	if (item.title.indexOf('设置') > -1) {
		return(btnHtml(props, item, iKey))
	}
	if (item.title.indexOf('服务开通状态') > -1) {
		let openStatus = [
			{img: props.data.quikeOpen && props.data.showInternet ? 'chat2Cur' : 'chat2', fee: props.data.quikePrice, style: {height: '.14rem'},color: props.data.quikeOpen && props.data.showInternet ? '#003E7F' : '#C1C1C1'},
			{img: props.data.imageAndTextOpen && props.data.showInternet ? 'chat1Cur' : 'chat1', fee: props.data.imageAndTextPrice, style: {height: '.14rem', padding: `0 ${theme.lrmargin}`}, color: props.data.imageAndTextOpen && props.data.showInternet ? '#003E7F' : '#C1C1C1'},
			{img: props.data.videoOpen && props.data.showInternet ? 'viedoCur' : 'viedo', fee: props.data.videoPrice, style: {height: '.12rem'}, color: props.data.videoOpen && props.data.showInternet ? '#003E7F' : '#C1C1C1'}
		]
		return (
			<li className={'left flex tb-flex lr-flex'} key={iKey} style={item.style}>
				{
					openStatus.map((openstatusItem, openstatusIkey) => {
						return (
							<p key={openstatusIkey} className='flex tb-flex tb-flex'>
								<img src={`/static/${HOSPITALINFO.hospital_short_name}/${openstatusItem.img}.png`} style={openstatusItem.style} />
								<article style={{color: openstatusItem.color, lineHeight: '16px', fontSize: 12}}>{openstatusItem.fee || ''}</article>
								<style jsx>{`
									p{
										flex-direction: column
									}
								`}</style>
							</p>
						)
					})
				}
		</li>)
	}
	if (item.title.indexOf('图文问诊') > -1) {
		return (normalHtml(props.data.imageAndTextPrice, item, iKey))
	}
}

const orderCon7 = (props, item, iKey) => {
	if (item.title.indexOf('设置') > -1) {
		return (btnHtml(props, item, iKey))
	}
	if (item.title.indexOf('快速问诊') > -1) {
		return (normalHtml(props.data.quikePrice, item, iKey))
	}
}

const orderCon8 = (props, item, iKey) => {
	if (item.title.indexOf('服务开通状态') > -1) {
		return (btnHtml(props, item, iKey))
	}
	if (item.title.indexOf('视频问诊') > -1) {
		return (normalHtml(props.data.videoPrice, item, iKey))
	}
}

const orderCon9 = (props, item, iKey) => {
	return (btnHtml(props, item, iKey))
}

function mapStateToProps (state) {
  return {
    doctors: state.doctor.data,
    loading: state.doctor.loading,
    error: state.doctor.error
  }
}

export default connect(mapStateToProps, { queryDoctors, showPrompt, updateDoctor })(ManageListItem)
