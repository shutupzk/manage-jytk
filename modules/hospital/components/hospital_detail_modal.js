import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter} from 'components'
import Link from 'next/link'
import {DEPARTMENTINFO} from '../config'

export default class HospitalDetailModal extends Component {
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
	const {selectedData, modalType, data, selectedType, titleInfo} = self.props;
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
									values[titleInfo[titleInfoItem].apiKey] = self.refs[refName] && self.refs[refName].value
								}
							}
							console.log('-----values---modal', values)
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
	const {selectedData, modalType, titleInfo, noticesGroups, hospital, page} = self.props;
	if (modalType === 'delete') {
		return (
			<div style={{padding: '.3rem .25rem', color: theme.mainfontcolor}}>您确定要删除<span style={{color: theme.maincolor}}>{selectedData.hospitalName}</span>吗？</div>
		)
	}
	if (modalType === 'modify' || modalType === 'add') {
		return (
			<div style={{padding: '20px 30px'}}>
				{
					titleInfo.map((titleInfoItem, iKey) => {
						if (titleInfoItem.title.indexOf('设置') > -1 ||
							titleInfoItem.title.indexOf('医院logo') > -1) {
							return
						}
						if (titleInfoItem.type === 'input') {
							return (
								<dl key={iKey} className='flex tb-flex'
									style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
									<dt>{titleInfoItem.title}</dt>
									<dd><input type='text' defaultValue={selectedData[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>
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
											defaultValue={selectedData[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}></textarea>
									</dd>
								</dl>
							)
						}
						if (titleInfoItem.type === 'select') {
							let selectData = page === 'guideType' ?
															{data: hospital, valueKey: 'id', valueName: 'hospitalName'} :
															{data: noticesGroups, valueKey: 'id', valueName: 'name'}
							return (
								<dl key={iKey} className='flex tb-flex'
									style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
									<dt>{titleInfoItem.title}</dt>
									<dd className='select' style={{borderRadius: 0, padding: 0, width: '80%'}}>
										<select defaultValue={selectedData[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}>
											{
												selectData.data && selectData.data.map((noticesGroup) => {
													return (
														<option value={noticesGroup[selectData.valueKey]} key={noticesGroup[selectData.valueKey]}>{noticesGroup[selectData.valueName]}</option>
													)
												})
											}
										</select>
									</dd>
								</dl>
							)
						}
						if (titleInfoItem.type === 'image') {
							return (
								<dl key={iKey} className='flex tb-flex'
									style={{fontSize: theme.fontsize, color: theme.mainfontcolor, display: 'none'}}>
									<dt>{titleInfoItem.title}</dt>
									<dd className='select' style={{borderRadius: 0, padding: 0, width: '80%'}}>
										<input type='file' defaultValue={selectedData[titleInfoItem.apiKey]}
										ref={`${titleInfoItem.apiKey}Ref`}
										value={'image'} />
									</dd>
								</dl>
							)
						}
					})
				}
				<style jsx global>{`
					dl{
						padding: ${theme.tbmargin} 0;
					}
					dt{
						color: theme.fontcolor;
						padding-right: ${theme.tbmargin};
					}
					dd{
						width: 80%;
					}
					input{
						line-height: 30px;
						width: 100%;
					}
				`}</style>
			</div>
		)
	}
}
const showHtml = (self, titleInfoItem) => {
	const {selectedData, modalType, titleInfo} = self.props;
	if (titleInfoItem.title.indexOf('名称') > -1 ||
		titleInfoItem.title.indexOf('编码') > -1 ||
		titleInfoItem.title.indexOf('联系电话') > -1 ||
		titleInfoItem.title.indexOf('所在地址') > -1) {
		return (<dd><input type='text' defaultValue={selectedData[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>)
	}
	if (titleInfoItem.title.indexOf('医院介绍') > -1) {
		return (
			<dd style={{width: '80%'}}>
				<textarea
					style={{width: '100%', border: `1px solid ${theme.bordercolor}`, minHeight: '1rem'}}
					defaultValue={selectedData[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}></textarea>
			</dd>
		)
	}
}
