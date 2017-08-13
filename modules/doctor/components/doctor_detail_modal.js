import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter} from 'components'
import Link from 'next/link'
import {DOCTORINFO} from 'config'
const titleInfo = [
	{title: '医生工号', value: '', style: {width: '12%'}, apiKey: 'doctorSn', type: 'input', notModify: true},
	{title: '医生姓名', value: '', style: {width: '12%'}, apiKey: 'doctorName', type: 'input', notModify: true},
	{title: '擅长领域', value: '', style: {width: '20%'}, apiKey: 'major', type: 'textarea'},
	{title: '医生性别', value: '', style: {width: '12%'}, apiKey: 'sex', type: 'input'},
	{title: '是否推荐', value: '', style: {width: '12%'}, apiKey: 'recommend', type: 'checkbox'},
	{title: '是否热门', value: '', style: {width: '12%'}, apiKey: 'hot', type: 'checkbox'},
	{title: '是否挂号', value: '', style: {width: '12%'}, apiKey: 'isAppointment', type: 'checkbox'},
	{title: '联系电话', value: '', style: {width: '20%'}, apiKey: 'phone', type: 'input'},
	{title: '工作年限', value: '', style: {width: '12%'}, apiKey: 'workingYears', type: 'number'},
	{title: '个人描述', value: '', style: {width: '12%'}, apiKey: 'description', type: 'textarea'},
]

export default class DoctorDetailModal extends Component {
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
	}

	componentWillReceiveProps(nextProps) {
	}

  render () {
    return (
			<div>{renderModal(this)}</div>
    )
  }
}


const renderModal = (self) => {
	const {selectedDoctor, modalType, data, selectedType} = self.props;
	return (
		<Modal showModalState={self.props.showModal} style={{top: '12%'}} sectionStyle={{width: modalType === 'delete' ? '30%': '50%'}}>
			{modalHeaderView(self)}
			{
				selectedType === 1 ?
					''
				: renderDepartmentInfoModal(self)
			}
			<ModalFooter>
				<article style={{width: '50%'}}>
					<button className='btnBorder'
						style={{display: 'inline-block', width: '100%', borderRadius: '2px 0 0 2px', lineHeight: '36px', border: 'none', fontSize: theme.mainfontsize,
							borderRight: `1px solid ${theme.bordercolor}`}}
						onClick={() => self.props.onHide()}>取消</button>
				</article>
					<button className='btnBorder'
						style={{display: 'inline-block', lineHeight: '36px', border: 'none', width: '50%', fontSize: theme.mainfontsize, color: theme.maincolor}}
						onClick={() => {
							let values = {}
							for (const titleInfoItem in titleInfo) {
								const refName = titleInfo[titleInfoItem].apiKey + 'Ref'
								if (refName !== 'Ref') {
									if (titleInfo[titleInfoItem].type === 'checkbox') {
										values[titleInfo[titleInfoItem].apiKey] = self.refs[refName] && self.refs[refName].checked
									} else if(titleInfo[titleInfoItem].type === 'number') {
										values[titleInfo[titleInfoItem].apiKey] = self.refs[refName] && self.refs[refName].value || 0
									} else {
										values[titleInfo[titleInfoItem].apiKey] = self.refs[refName] && self.refs[refName].value
									}
								}
							}
							self.props.clickModalOk(data, modalType, values)}
						}>确定</button>
			</ModalFooter>
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
	return (
		<ModalHeader showCloseBtn
			onHide={() => self.props.onHide()}>
			<div style={{borderBottom: `1px solid ${theme.bordercolor}`, width:'80%', fontSize: theme.nfontsize, color: theme.nfontcolor}}>
				<span className='left' style={curHaderItemStyle}
					onClick={() => self.props.changeType(0)}>基本信息</span>
				<p className='clearfix'></p>
			</div>
		</ModalHeader>
	)
}

const renderDepartmentInfoModal = (self) => {
	// const modalHeight = document && document.body.clientWidth * 0.3
	const {selectedDoctor, modalType} = self.props;
	if (modalType === 'delete') {
		return (
			<div style={{padding: '.3rem .25rem', color: theme.mainfontcolor}}>您确定要删除<span style={{color: theme.maincolor}}>{selectedDoctor.deptName}</span>吗？</div>
		)
	}
	if (modalType === 'modify' || modalType === 'add') {
		console.log('-----titleInfo', selectedDoctor)
		return (
			<div style={{padding: '20px 30px', maxHeight: 400, overflow: 'auto'}}>
				{
					titleInfo.map((titleInfoItem, iKey) => {
						if (titleInfoItem.type === 'input') {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd>
									{
										modalType === 'modify' && titleInfoItem.notModify ?
										<input type='input' disabled defaultValue={selectedDoctor[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} />
									:
										<input type='input' defaultValue={selectedDoctor[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} />
									}
								</dd>
							</dl>
							)
						}
						if (titleInfoItem.type === 'number') {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd><input type='number' defaultValue={selectedDoctor[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
							</dl>
							)
						}
						if (titleInfoItem.type === 'checkbox') {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd><input type='checkbox' defaultChecked={selectedDoctor[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
							</dl>
							)
						}
						if (titleInfoItem.type === 'textarea') {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd style={{width: '80%'}}>
									<textarea
										style={{width: '100%', border: `1px solid ${theme.bordercolor}`, minHeight: '1rem'}}
										defaultValue={selectedDoctor[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}></textarea>
								</dd>
							</dl>
							)
						}
						
					})
				}
				<style jsx>{`
					dl{
						padding: ${theme.tbmargin} 0;
					}
					dt{
						color: theme.fontcolor;
						padding-right: ${theme.tbmargin};
					}
				`}</style>
			</div>
		)
	}
}