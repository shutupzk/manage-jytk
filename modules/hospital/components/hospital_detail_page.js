import React, { Component } from 'react'
import Router from 'next/router'
import {theme, DraftCard} from 'components'
import Link from 'next/link'
import {DEPARTMENTINFO} from '../config'

export default class HospitalDetailPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
			editorState: '',
			// hospitalName: props.selectedData && props.selectedData.hospitalName
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
	const {selectedData, selectedType, titleInfo} = self.props;
	return (
		<div>
			{
				selectedType === 1 ?
					''
				: renderDepartmentInfoModal(self)
			}
			<div className='flex tb-flex lr-flex'>
				<button className='btnBorder btnBorderMain'
						style={{lineHeight: '26px', width: '20%', color: '#fff', background: theme.nfontcolor, borderColor: theme.nfontcolor, marginRight: 15}}
						onClick={() => self.props.onHide()}>取消</button>
				<button className='btnBorder btnBorderMain'
					style={{lineHeight: '26px', width: '20%', color: '#fff', background: theme.maincolor}}
					onClick={() => {
						let values = {}
						for (const titleInfoItem in titleInfo) {
							const refName = titleInfo[titleInfoItem].apiKey + 'Ref'
							if (refName !== 'Ref') {
								if (titleInfo[titleInfoItem].type === 'checkbox') {
									values[titleInfo[titleInfoItem].apiKey] = self.refs[refName] && self.refs[refName].checked
								} else if (titleInfo[titleInfoItem].type === 'textarea') {
									values[titleInfo[titleInfoItem].apiKey] = self.state.editorState || selectedData[titleInfo[titleInfoItem].apiKey]
								} else {
									values[titleInfo[titleInfoItem].apiKey] = self.refs[refName] && self.refs[refName].value
								}
							}
						}
						self.props.clickModalOk(values)}
					}>确定</button>
			</div>
		</div>
	)
}

const renderDepartmentInfoModal = (self) => {
	// const modalHeight = document && document.body.clientWidth * 0.3
	const {modalType, titleInfo, noticesGroups, hospital, page} = self.props;
	const selectedData = self.props.selectedData || {}
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
									<dd>
										<input type='text' defaultValue={selectedData[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} />
									</dd>
								</dl>
							)
						}
						if (titleInfoItem.type === 'textarea') {
							return (
								<dl key={iKey} className='flex tb-flex'
									style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
									<dt>{titleInfoItem.title}</dt>
									<dd style={{width: '80%'}}>
										<DraftCard defaultValue={selectedData[titleInfoItem.apiKey]} onEditorStateChange={(html) => {
											 self.setState({editorState: html}) 
										}} />
										{/* <textarea
											style={{width: '100%', border: `1px solid ${theme.bordercolor}`, minHeight: '1rem'}}
											defaultValue={selectedData[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}></textarea> */}
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
