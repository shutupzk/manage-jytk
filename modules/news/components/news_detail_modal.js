import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter} from 'components'
import Link from 'next/link'
import {DEPARTMENTINFO} from '../config'

export default class NewsDetailModal extends Component {
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
		console.log('-----props', this.props.selectedNews)
	}

	componentWillReceiveProps(nextProps) {
		console.log('-------willprops', nextProps.selectedNews)
	}

  render () {
    return (
			<div>{renderModal(this)}</div>
    )
  }
}

const renderModal = (self) => {
	const {selectedNews, modalType, data, selectedType, titleInfo} = self.props;
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
								{/* values.newsGroupId = self.refs.newsGroupIdRef && self.refs.newsGroupIdRef.value */}
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
	const {selectedNews, modalType, titleInfo, newsGroups} = self.props;
	if (modalType === 'delete') {
		return (
			<div style={{padding: '.3rem .25rem', color: theme.mainfontcolor}}>您确定要删除<span style={{color: theme.maincolor}}>{selectedNews.deptName}</span>吗？</div>
		)
	}
	if (modalType === 'modify' || modalType === 'add') {
		return (
			<div style={{padding: '20px 30px'}}>
				{
					titleInfo.map((titleInfoItem, iKey) => {
						if (titleInfoItem.title.indexOf('设置') > -1 || titleInfoItem.title.indexOf('发布时间') > -1) {
							return
						} else {
							return (
								<dl key={iKey} className='flex tb-flex'
									style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
									<dt>{titleInfoItem.title}</dt>
									{showHtml(self, titleInfoItem)}
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
					input{
						line-height: 30px;
						width: 100%;
					}
					dd{
						width: 84%
					}
				`}</style>
			</div>
		)
	}
}

const showHtml = (self, titleInfoItem) => {
	const {selectedNews, modalType, titleInfo} = self.props;
	if (titleInfoItem.title.indexOf('资讯标题') > -1 ||
		titleInfoItem.title.indexOf('资讯摘要') > -1) {
		return (<dd><input type='text' defaultValue={selectedNews[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`} /></dd>)
	}
	if (titleInfoItem.title.indexOf('资讯类型') > -1) {
		return (
			<dd className='select' style={{padding: 0, borderRadius: 0}}>
				<select defaultValue={selectedNews[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}>
					{
						self.props.newsGroups.map((newsGroup) => {
							return (
								<option key={newsGroup.id} value={newsGroup.id}>{newsGroup.type}</option>
							)
						})
					}
				</select>
			</dd>
		)
	}
	if (titleInfoItem.title.indexOf('资讯内容') > -1) {
		return (
			<dd>
				<textarea
					style={{width: '100%', border: `1px solid ${theme.bordercolor}`, minHeight: '1rem'}}
					defaultValue={selectedNews[titleInfoItem.apiKey]} ref={`${titleInfoItem.apiKey}Ref`}></textarea>
			</dd>
		)
	}
}
