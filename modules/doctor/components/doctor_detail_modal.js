import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter} from 'components'
import Link from 'next/link'
import {DOCTORINFO} from 'config'
const titleInfo = [
	{title: '医生工号', value: '', style: {width: '12%'}, apiKey: 'doctorSn', type: 'input', notModify: true},
	{title: '医生姓名', value: '', style: {width: '12%'}, apiKey: 'doctorName', type: 'input', notModify: true},
	{title: '医生头像', value: '', style: {width: '12%'}, apiKey: 'avatar', type: 'image'},
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
			baseImg: ''
    }
	}

  clickDescribeAddImg(event) {
    // 将图片转为base64
    const file = (event.target).files[0];
    const curComponent = this;
    curComponent.processfile(file, curComponent);
  }

  // 将图片转为base64
  processfile(file, curComponent) {
    const reader = new FileReader();
    reader.onload = function readerLoad(event) {
      const blob = new Blob([event.target.result]);
      window.URL = window.URL || window.webkitURL;
      const blobURL = window.URL.createObjectURL(blob);
      const image = new Image();
      image.src = blobURL;
      image.onload = function imgOnload() {
        const base64ResizedImg = curComponent.resizeMe(image);
				// curComponent.props.uploadImg({pic: base64ResizedImg});
				curComponent.setState({
					baseImg: base64ResizedImg
				})
      };
    };
    reader.readAsArrayBuffer(file);
  }

  // 压缩图片
  resizeMe(img) {
    //  压缩的大小
    const max_width = 1000;
    const max_height = 700;
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;
    if (width > height && width > max_width) {
      height = Math.round(height *= max_width / width);
      width = max_width;
    } else if (height > max_height) {
      width = Math.round(width *= max_height / height);
      height = max_height;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    //  压缩率
    return canvas.toDataURL('image/jpeg', 0.7);
  }

  render () {
		const {selectedDoctor, modalType, selectedType} = this.props;
    return (
			<Modal showModalState={this.props.showModal} style={{top: '12%'}} sectionStyle={{width: modalType === 'delete' ? '30%': '50%'}}>
				{modalHeaderView(this)}
				{
					selectedType === 1 ?
						''
					: renderDepartmentInfoModal(this)
				}
				<ModalFooter>
					<article style={{width: '50%'}}>
						<button className='btnBorder'
							style={{display: 'inline-block', width: '100%', borderRadius: '2px 0 0 2px', lineHeight: '36px', border: 'none', fontSize: theme.mainfontsize,
								borderRight: `1px solid ${theme.bordercolor}`}}
							onClick={() => this.props.onHide()}>取消</button>
					</article>
					<button className='btnBorder'
						style={{display: 'inline-block', lineHeight: '36px', border: 'none', width: '50%', fontSize: theme.mainfontsize, color: theme.maincolor}}
						onClick={() => {
							let values = {}
							for (const titleInfoItem in titleInfo) {
								const refName = titleInfo[titleInfoItem].apiKey + 'Ref'
								if (refName !== 'Ref') {
									if (titleInfo[titleInfoItem].type === 'checkbox') {
										values[titleInfo[titleInfoItem].apiKey] = this.refs[refName] && this.refs[refName].checked
									} else if (titleInfo[titleInfoItem].type === 'image') {
										values[titleInfo[titleInfoItem].apiKey] = this.state.baseImg || selectedDoctor[titleInfo[titleInfoItem].apiKey]
									} else {
										values[titleInfo[titleInfoItem].apiKey] = this.refs[refName] && this.refs[refName].value
									}
								}
							}
							this.props.clickModalOk(modalType, values)}
						}>确定</button>
				</ModalFooter>
			</Modal>
    )
  }
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
						if (titleInfoItem.type === 'image') {
							return (
							<dl key={iKey} className='flex tb-flex'
								style={{fontSize: theme.fontsize, color: theme.mainfontcolor}}>
								<dt>{titleInfoItem.title}</dt>
								<dd>
									<img style={{display: (self.state.baseImg || selectedDoctor[titleInfoItem.apiKey]) ? 'block' : 'none', width: 60, marginBottom: 10}}
										src={self.state.baseImg || selectedDoctor[titleInfoItem.apiKey]} />
									<input type='file' onChange={(event) => self.clickDescribeAddImg(event)} />
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