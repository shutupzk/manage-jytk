import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter} from 'components'
import Link from 'next/link'
import {DEPARTMENTINFO} from '../config'

export default class DepartmentDetailModal extends Component {
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
		console.log('-----props', this.props.selectedDepartment)
	}

	componentWillReceiveProps(nextProps) {
		console.log('-------willprops', nextProps.selectedDepartment)
	}

  render () {
    return (
			<div>{renderModal(this)}</div>
    )
  }
}

const renderModal = (self) => {
	const {selectedDepartment, modalType, data, selectedType, titleInfo} = self.props;
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
									if (refName === 'hotRef' || refName === 'isAppointmentRef') {
										values[titleInfo[titleInfoItem].apiKey] = self.refs[refName] && self.refs[refName].checked
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
	const {selectedDepartment, modalType, titleInfo} = self.props;
	if (modalType === 'delete') {
		return (
			<div style={{padding: '.3rem .25rem', color: theme.mainfontcolor}}>您确定要删除<span style={{color: theme.maincolor}}>{selectedDepartment.deptName}</span>吗？</div>
		)
	}
	if (modalType === 'modify' || modalType === 'add') {
		return (
			<div style={{padding: '20px 30px'}}>
				{
					titleInfo.map((titleInfoItem, iKey) => {
						if (titleInfoItem.title.indexOf('设置') > -1) {
							return
						}
						if (titleInfoItem.title.indexOf('是否可挂号') > -1 && self.props.isAppointPage) {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd><input type='checkbox' defaultChecked={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
							</dl>
							)
						}
						if (titleInfoItem.title.indexOf('是否推荐') > -1 && !self.props.isAppointPage && self.props.recommandPage) {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd><input type='checkbox' defaultChecked={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
							</dl>
							)
						}
						if (titleInfoItem.title.indexOf('科室名称') > -1 && !self.props.recommandPage) {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd><input type='text' defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
							</dl>
							)
						}
						if (titleInfoItem.title.indexOf('科室编码') > -1 && !self.props.recommandPage) {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd><input type='text' defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
							</dl>
							)
						}
						if (titleInfoItem.title.indexOf('科室介绍') > -1 && !self.props.recommandPage) {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd style={{width: '80%'}}>
									<textarea
										style={{width: '100%', border: `1px solid ${theme.bordercolor}`, minHeight: '1rem'}}
										defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}></textarea>
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

const frameHtml = (self, titleInfoItem, iKey) => {
	const {selectedDepartment, modalType, titleInfo} = self.props;
	let html;
	if (titleInfoItem.title.indexOf('是否可挂号') > -1 && self.props.isAppointPage) {
	html = (
		<dl key={iKey} className='flex tb-flex'
			style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
			<dt>{titleInfoItem.title}</dt>
			<dd><input type='checkbox' defaultChecked={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
		</dl>
		)
	}
	if (titleInfoItem.title.indexOf('是否推荐') > -1 && self.props.recommandPage) {
		html = (
		<dl key={iKey} className='flex tb-flex'
			style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
			<dt>{titleInfoItem.title}</dt>
			<dd><input type='checkbox' defaultChecked={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
		</dl>
		)
	}
	if (titleInfoItem.title.indexOf('科室名称') > -1 && !self.props.recommandPage) {
		html = (
		<dl key={iKey} className='flex tb-flex'
			style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
			<dt>{titleInfoItem.title}</dt>
			<dd><input type='text' defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
		</dl>
		)
	}
	if (titleInfoItem.title.indexOf('科室编码') > -1 && !self.props.recommandPage) {
		html = (
		<dl key={iKey} className='flex tb-flex'
			style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
			<dt>{titleInfoItem.title}</dt>
			<dd><input type='text' defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
		</dl>
		)
	}
	if (titleInfoItem.title.indexOf('科室介绍') > -1 && !self.props.recommandPage) {
		html = (
		<dl key={iKey} className='flex tb-flex'
			style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
			<dt>{titleInfoItem.title}</dt>
			<dd style={{width: '80%'}}>
				<textarea
					style={{width: '100%', border: `1px solid ${theme.bordercolor}`, minHeight: '1rem'}}
					defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}></textarea>
			</dd>
		</dl>
		)
	}
	return html
}