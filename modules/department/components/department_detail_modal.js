import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter} from 'components'
import Link from 'next/link'
import {DEPARTMENTINFO} from '../config'

export default class DepartmentDetailModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
	}

	componentWillMount() {
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
									if (titleInfo[titleInfoItem].inputType === 'checkbox') {
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
	const {selectedDepartment, modalType, titleInfo, departmentSelect, config} = self.props;
	const detailPage = self.props.detailPage
	const recommandPage = self.props.recommandPage
	const isAppointPage = self.props.isAppointPage
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
						if (titleInfoItem.inputType === 'checkbox') {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd>
									{
										(isAppointPage && titleInfoItem.title.indexOf('推荐') > -1) || (recommandPage && titleInfoItem.title.indexOf('挂号') > -1) ?
											<input type='checkbox' disabled defaultChecked={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} />
										:
											<input type='checkbox' defaultChecked={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} />
									}
								</dd>
							</dl>
							)
						}
						if (titleInfoItem.inputType === 'text') {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd>
									{
										detailPage ?
											<input type='text' disabled defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} />
										:
											<input type='text' defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} />
									}</dd>
							</dl>
							)
						}
						if (titleInfoItem.inputType === 'select') {
							let curSelect = config.filter((configItem) => {return configItem.title.indexOf(titleInfoItem.title) > -1})
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd className='select' style={{borderRadius: 0, padding: 0}}>
									{
										detailPage ?
											<select disabled defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}>
												{
													curSelect[0].selectData && curSelect[0].selectData.map((departmentSelectItem, deptKey) => {
														return (
															<option value={departmentSelectItem[curSelect[0].valueKey]} key={deptKey}>{departmentSelectItem[curSelect[0].titleKey]}</option>
														)
													})
												}
											</select>
										:
											<select defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}>
												{
													curSelect[0].selectData && curSelect[0].selectData.map((departmentSelectItem, deptKey) => {
														return (
															<option value={departmentSelectItem[curSelect[0].valueKey]} key={deptKey}>{departmentSelectItem[curSelect[0].titleKey]}</option>
														)
													})
												}
											</select>
									}
								</dd>
							</dl>
							)
						}
						if (titleInfoItem.inputType === 'textarea') {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd style={{width: '80%'}}>
									{
										detailPage ?
											<textarea disabled
												style={{width: '100%', border: `1px solid ${theme.bordercolor}`, minHeight: '1rem'}}
												defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}></textarea>
										: 
											<textarea
												style={{width: '100%', border: `1px solid ${theme.bordercolor}`, minHeight: '1rem'}}
												defaultValue={selectedDepartment[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}></textarea>
									}
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
						{/* padding-right: ${theme.tbmargin}; */}
						width: 18%;
						padding-right: 2%;
						text-align: right;
					}
					dd{
						width: 80%;
					
					}
					input{
						width: 100%;
						border: 1px solid ${theme.bordercolor};
						line-height: 30px;
					}
				`}</style>
			</div>
		)
	}
}