import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter} from 'components'
import Link from 'next/link'
import {ORDERTYPE, DOCTORINFO, HOSPITALINFO, HOSPITAL_NAME} from 'config'

export default class ManageDoctorModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
			fastSchedules: [],
			videoSchedules: [],
			videoTime: {
				time: '',
				num: ''
			}
    }
	}

	componentWillMount() {
		console.log('-----props', this.props.selectedDoctor)
	}

	componentWillReceiveProps(nextProps) {
		console.log('-------willprops', nextProps.selectedDoctor)
	}

  render () {
    return (
			<div>{renderModal(this)}</div>
    )
  }
}

const renderModal = (self) => {
	const {selectedDoctor, selectedType} = self.props;
	return (
		<Modal showModalState={self.props.showModal} style={{top: '12%'}}>
			{modalHeaderView(self)}
			{
				selectedType === 1 ?
					renderServiceModal(self)
				: renderDoctorInfoModal(self)
			}
			{
				selectedType === 1 ?
					<ModalFooter>
						<article style={{width: '100%',textAlign: 'right', lineHeight: '46px'}}>
							<button className='btnBG btnBGMain btnBGLitt'
								style={{display: 'inline-block', marginRight: 20, width: 130, borderRadius: 4}}>确定</button>
						</article>
					</ModalFooter>
				: ''
			}
		</Modal>
	)
}

const modalHeaderView = (self) => {
	let headerItemStyle ={
		borderBottom: `4px solid #fff`,
		paddingBottom: theme.midmargin,
		marginRight: theme.tbmargin, cursor: 'pointer'
	}
	let curHaderItemStyle = {
		borderBottom: `4px solid ${theme.maincolor}`,
		color: theme.maincolor,
		paddingBottom: theme.midmargin,
		marginRight: theme.tbmargin, cursor: 'pointer'
	}
	const {typeTitle} = self.props
	return (
		<ModalHeader showCloseBtn
			onHide={() => self.props.onHide()}>
			<div style={{borderBottom: `1px solid ${theme.bordercolor}`, width:'80%', fontSize: theme.nfontsize, color: theme.nfontcolor}}>
				{
					typeTitle && typeTitle.map((typeTitleItem) => {
						return (
							<span key={typeTitleItem.value} className='left'
								style={self.props.selectedType === typeTitleItem.value ? curHaderItemStyle : headerItemStyle}
								onClick={() => self.props.changeType(typeTitleItem.value)}>{typeTitleItem.title}</span>
						)
					})
				}
				<p className='clearfix'></p>
			</div>
		</ModalHeader>
	)
}

const renderServiceModal = (self) => {
	const modalHeight = process.browser? document.body.clientWidth * 0.3 : 500
	const {selectedDoctor, selectedType, pageType} = self.props;
	const serviceCon = [
		{title: '专家图文问诊', apiKey: 'imageAndTextPrice', ref: 'imageText'},
		{title: '快速问诊', apiKey: 'imageAndTextPrice', ref: 'fast'},
		{title: '视频问诊', apiKey: 'videoPrice', ref: 'video'}
	]
	return (
		<div style={{height: modalHeight, overflow: 'auto', padding: `${theme.tbmargin} .25rem`}}>
			<dl>
				<img className='left' src={selectedDoctor.avatar} style={{width: '.3rem', height: '.3rem', paddingRight: '.12rem'}} />
				<span className='left' style={{fontSize: 12, color: theme.mainfontcolor, lineHeight: '.3rem'}}>{selectedDoctor.doctorName}</span>
				<p className='clearfix'></p>
			</dl>
			{
				serviceCon.map((item, index) => {
					return (
						<div style={{paddingTop: '.25rem',color: theme.mainfontcolor}} key={index}>
							<header style={{ fontSize: theme.nfontsize, paddingBottom: theme.tbmargin}} className='flex tb-flex'>
								<article className='checkbox'>
									<label htmlFor={`service${index}`}></label>
									<input type='checkbox' id={`service${index}`} />
								</article>
								<strong style={{fontSize: 14, paddingRight: theme.tbmargin}}>{item.title}</strong>
								已服务&nbsp;<span style={{color: theme.maincolor}}>{selectedDoctor.serviceTotal}</span>&nbsp;单
							</header>
							<article className='flex tb-flex' style={{fontSize: 12, paddingLeft: 24}}>
								收取费用&nbsp;&nbsp;
								{pageType === 'schedule' ?
								<input type='text' ref={`${item.ref}Ref`} disabled defaultValue={selectedDoctor[item.apiKey]} style={{background: '#F2F2F2', border: `1px solid ${theme.bordercolor}`, lineHeight: '18px', width: 60, borderRadius: 2}} />
								:<input type='text' ref={`${item.ref}Ref`} defaultValue={selectedDoctor[item.apiKey]} style={{background: '#F2F2F2', border: `1px solid ${theme.bordercolor}`, lineHeight: '18px', width: 60, borderRadius: 2}} />
								}&nbsp;元/次
							</article>
							{
								item.title === '快速问诊' ?
									renderFastSchedule(self)
								: ''
							}
							{
								item.title === '视频问诊' ?
									renderVideoSchedule(self)
								: ''
							}
						</div>
					)
				})
			}
		</div>
	)
}

const renderVideoSchedule = (self) => {
	return (
		<div style={{ marginTop: theme.lrmargin, paddingLeft: 24}}>
			{tableView(self, 'video')}
			<ul className='left' style={{color: theme.mainfontcolor, width: '40%', fontSize: 12, border: `1px solid ${theme.bordercolor}`}}>
				<li style={{background: '#f2f2f2'}}>
					<span style={{width: '40%'}}>时间段</span>
					<span style={{width: '20%', textAlign: 'center'}}>号数</span>
					<span style={{width: '40%', textAlign: 'center'}}>操作</span>
				</li>
				<li>
					<span className='left' style={{width: '40%'}}>14:30-15:00</span>
					<span className='left' style={{width: '20%', textAlign: 'center'}}>
						{self.props.pageType === 'schedule' ?
						<input type='number' style={{width: '100%', textAlign: 'center'}} value={self.state.videoTime.number}
							onChange={(e) => {
								const prevVideoTime = self.state.videoTime
								self.setState({
									videoTime: Object.assign({}, prevVideoTime, {number: e.target.value})
								})
							}} />
						:<input type='number' disabled style={{width: '100%', textAlign: 'center'}} value={self.state.videoTime.number} />
						}
					</span>
					<article className='left' style={{width: '40%', textAlign: 'center', height: 30}}>
						<img src='/static/icons/modify.png' style={{height: 16, paddingTop: 6, paddingRight: 6}} />
						<img src='/static/icons/delete.png' style={{height: 16, paddingTop: 6}} />
					</article>
					<p style={{lineHeight: '30px', color: theme.maincolor, cursor: 'pointer'}}>+新增时间段</p>
					<div className='clearfix'></div>
				</li>
			</ul>
			<style jsx>{`
				li{
					line-height: 30px;
					padding-left: ${theme.lrmargin};
				}
				span, article{
					display: inline-block
				}
				li:nth-of-type(2n+1) {
					background: #fbfbfb;
				}
			`}</style>
			<p className='clearfix'></p>
		</div>
	)
}

const tableView = (self) => {
	const tableTh = [
		{title: '', width: '20px', height: '44px'},
		{title: '一', width: '44px'},
		{title: '二', width: '44px'},
		{title: '三', width: '44px'},
		{title: '四', width: '44px'},
		{title: '五', width: '44px'},
		{title: '六', width: '44px'},
		{title: '日', width: '44px'}
	]
	return (
		<table className='left' style={{cellPadding: 0, borderSpacing: 0, paddingRight: theme.lrmargin}}>
			<tr className='flex'>
				{
					tableTh.map((item, iKey) => {
						return (
							<th className='flex tb-flex lr-flex' style={{background: '#E8EEFA', lineHeight: '20px', width: item.width}} key={iKey}>
								{item.title}<i style={{height: '21px'}}></i>
							</th>
						)
					})
				}
			</tr>
			{
				['上', '下', '晚'].map((time, index) => {
					return (
						<tr key={index} className='flex'>
							{
								tableTh.map((item, iKey) => {
									if (iKey === 0) {
										return (
											<td className='flex tb-flex lr-flex' style={{width: item.width, height: item.height}} key={iKey}>{time}<i></i></td>
										)
									} else {
										return (
											<td className='flex tb-flex lr-flex' style={{width: item.width, height: item.width}} key={iKey}>
												{/* <img src={`/static/${HOSPITALINFO.hospital_short_name}/pass2.png`} style={{ width: 18}} />  */}
												{/* <strong style={{color: theme.nfontcolor, fontSize: 20, fontWeight: 300}}>+</strong> */}
												<i></i>
											</td>
										)
									}
								})
							}
						</tr>
					)
				})
			}
			<style jsx>{`
				td, th{
					color: ${theme.mainfontcolor};
					text-align: center;
					{/* border-top: 1px solid ${theme.bordercolor}; */}
					{/* border-left: 1px solid ${theme.bordercolor}; */}
					font-size: 12px;
					position: relative;
					font-weight: 300;
				}
				td i, th i{
					position: absolute;
					height: 45px;
					width: 45px;
					top: -1px;
					left: -1px;
					border: 1px solid ${theme.bordercolor};
					display: block;
				}
				td:first-child i{width: 21px;}
				td:not(:first-child) {cursor: pointer;}
				td:not(:first-child):hover i{
					border: 1px solid ${theme.maincolor}
					width: 46px;
					height: 46px;
					z-index: 100;
				}
			`}</style>
		</table>
	)
}

const renderFastSchedule = (self) => {
	return (
		<div style={{ marginTop: theme.lrmargin, paddingLeft: 24}}>{tableView(self, 'fast')}<div className='clearfix'></div></div>
	)
}

const renderDoctorInfoModal = (self) => {
	const modalHeight = document && document.body.clientWidth * 0.3
	const doctorInfo = [
		{title: '姓名', apiKey: 'doctorName'},
		{title: '所在机构', apiKey: ''},
		{title: '职称', apiKey: 'title'},
		{title: '专业', apiKey: ''},
		{title: '工号', apiKey: 'doctorSn'},
		{title: '亚专业', apiKey: ''},
		{title: '年龄', apiKey: 'doctorName'},
		{title: '联系方式', apiKey: 'phone'},
	]
	const {selectedDoctor, selectedType} = self.props;
	const department = selectedDoctor.departmentHasDoctors && selectedDoctor.departmentHasDoctors[0] && selectedDoctor.departmentHasDoctors[0].department && selectedDoctor.departmentHasDoctors[0].department || {}
	return (
		<div style={{height: modalHeight, overflow: 'auto'}}>
			<div style={{padding: '.2rem .25rem .1rem'}} className='flex'>
				<img src={selectedDoctor.avatar} height='50px' width='50px' style={{paddingTop: '0rem'}} />
				<div style={{paddingLeft: '.2rem', width: '60%'}}>
					{
						doctorInfo.map((doctorInfoItem, iKey) => {
							let value = selectedDoctor[doctorInfoItem.apiKey]
							if (doctorInfoItem.title ==='所在机构') {
								value = department.hospital && selectedDoctor.departmentHasDoctors[0].department.hospital.hospitalName
							} else if (doctorInfoItem.title ==='专业') {
								value = department.deptName
							} else if (doctorInfoItem.title === '亚专业') {
								value = department.childs && department.childs[0] && selectedDoctor.departmentHasDoctors[0].department.childs[0].deptName
							}
							return (
								<p style={{fontSize: 12, color: theme.mainfontcolor, width: '50%'}} className='left' key={iKey}>
									{doctorInfoItem.title}：{value}
								</p>
							)
						})
					}
				</div>
				<p className='clearfix'></p>
			</div>
			<dl style={{ fontSize: theme.nfontsize,padding: '.2rem .25rem'}}>
				<dt style={{color: theme.nfontcolor, paddingBottom: theme.tbmargin}}>擅长领域</dt>
				<dd style={{color: theme.mainfontcolor, lineHeight: '.26rem'}}>{selectedDoctor.major}</dd>
			</dl>
			<dl style={{ fontSize: theme.nfontsize,padding: '.2rem .25rem'}}>
				<dt style={{color: theme.nfontcolor, paddingBottom: theme.tbmargin}}>医生简介</dt>
				<dd style={{color: theme.mainfontcolor, lineHeight: '.26rem'}}>{selectedDoctor.description}</dd>
			</dl>
		</div>
	)
}