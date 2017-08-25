import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter, ImgCard} from 'components'
import { connect } from 'react-redux'
import Link from 'next/link'
import {HOSPITALINFO} from 'config'
import {DEPARTMENTINFO} from '../config'

const hosName = HOSPITALINFO && HOSPITALINFO.hospital_short_name
// qiniu
import request from 'superagent-bluebird-promise'
import {showPrompt, changeImgBase64, selectdepartment} from '/ducks'

var isFunction = function (fn) {
  var getType = {}
  return fn && getType.toString.call(fn) === '[object Function]'
}
function formatMaxSize (size) {
  size = size.toString().toUpperCase()
  let bsize
  let m = size.indexOf('M')
  let k = size.indexOf('K')
  if (m > -1) {
    bsize = parseFloat(size.slice(0, m)) * 1024 * 1024
  } else if (k > -1) {
    bsize = parseFloat(size.slice(0, k)) * 1024
  } else {
    bsize = parseFloat(size)
  }
  return Math.abs(bsize)
}
class DepartmentDetailModal extends Component {
 	constructor (props) {
		super(props)
    var uploadUrl = 'http://upload.qiniu.com'
    if (process.browser && window.location.protocol === 'https:') {
      uploadUrl = 'https://up.qbox.me/'
		}
    this.state = {
			maxSize: '10M',
			uploadUrl: uploadUrl
    }
	}

  uploadFiles () {
    var files = this.props.imageFiles
    var maxFiles = 1
    files = Array.prototype.slice.call(files, 0, maxFiles)
    // this.onUpload(files)
    var maxSizeLimit = formatMaxSize(this.state.maxSize)
    for (var i = 0; i < maxFiles; i++) {
      if (maxSizeLimit && files[i].size > maxSizeLimit) {
        // console.trace && console.trace(new Error('文件大小错误!'))
        this.props.showPrompt({
          text: '上传的文件大小超出了限制:' + this.state.maxSize
        })
      } else {
        files[i].preview = process.browser && window.URL.createObjectURL(files[i])
        files[i].request = this.upload(files[i])
        files[i].uploadPromise = files[i].request.promise()
      }
    }
    files = Array.prototype.slice.call(files, 0, maxFiles)
		let result = this.onDrop(files)
		return result
  }
  upload (file) {
    if (!file || file.size === 0) return null
    // console.log(this.props.upTokens)
    const token = this.props.upTokens[file.name]
    var r = request
          .post(this.state.uploadUrl)
          .field('key', file.name)
          .field('token', token)
          .field('x:filename', file.name)
          .field('x:size', file.size)
          .attach('file', file, file.name)
          .set('Accept', 'application/json')
    if (isFunction(file.onprogress)) { r.on('progress', file.onprogress) }
    return r
  }
  onUpload (files) {
    // set onprogress function before uploading
    let progresses = {}
    let _this = this
    files.map(function (f) {
      f.onprogress = function (e) {
        progresses[f.preview] = e.percent
      }
    })
  }

  onDrop (files) {
    // console.log(files)
		let _this = this
    _this.setState({
      files: files
    })
    files.map((f) => {
      f.uploadPromise.then(function (res) {
        if (res.statusCode === 200) {
          // console.log('上传成功')
					// console.log(res.body)
					let img = 'http://7xwhc1.com1.z0.glb.clouddn.com/' + res.body.key
					_this.props.changeImgBase64({imgBase64: img})
					// todo 同步走， 等更新完七牛云后，再去走提交资料
					_this.props.selectdepartment({department: Object.assign({}, _this.props.selectedDepartment, {deptPic: img})})
					_this.props.clickModalOk(Object.assign({}, _this.props.selectedDepartment, {deptPic: img}))
        } else {
					// console.log('头像上传失败', res.error)
					_this.props.showPrompt({text: `头像上传失败${res.error}`})
					_this.props.changeImgBase64({imgBase64: null});
					return false
        }
      })
		})
    // console.log('Received files: ', files)
	}

	clickModalOk() {
		const {weightRef, deptNameRef, hotRef, isAppointmentRef, positionRef, descriptionRef, hospitalIdRef, deptSnRef} = this.refs || {}
		const {selectedDepartment} = this.props
		let weight = (weightRef.value == '' || weightRef.value == null) ? null : parseInt(weightRef.value, 10)
		const {modalType} = this.props
		let hospitalId = selectedDepartment.hospitalId
		let deptSn = selectedDepartment.deptSn
		if (modalType === 'add') {
			hospitalId = hospitalIdRef.value
			deptSn = deptSnRef
		}
		if (weight < 0) {
			this.props.showPrompt({text: '权重不能小于0'})
			return
		}
		const values = {
			weight, deptName: deptNameRef.value, hot: hotRef.checked, isAppointment: isAppointmentRef.checked,
			position: positionRef.value,
			description: descriptionRef.value,
			hospitalId: hospitalId,
			deptSn: deptSn
		}
		this.props.selectdepartment({department: Object.assign({}, this.props.selectedDepartment, values)})
		{/* 点击确定， 图片上传七牛云 检验base64是否存在，如果存在就说明需要上传七牛云 */}
		if (this.props.imgBase64) {
			this.uploadFiles()
		} else {
			this.props.clickModalOk(Object.assign({}, this.props.selectedDepartment, values))
		}
	}

  render () {
    return (
			<div>{renderModal(this)}</div>
    )
  }
}

const renderModal = (self) => {
	const {selectedDepartment, modalType, data, selectedType, titleInfo} = self.props;
	const modalHeight = process.browser? document && document.body.clientWidth * 0.82  : 500
	return (
		<Modal showModalState={self.props.showModal} style={{top: '12%'}} sectionStyle={{width: modalType === 'delete' ? '30%': '50%', maxHeight: modalHeight, minHeight: '200px'}}>
			{modalHeaderView(self)}
			{
				selectedType === 1 ?
					''
				: renderDepartmentInfoModal(self)
			}
			<ModalFooter>
				<article style={{width: '100%',textAlign: 'right', lineHeight: '46px'}}>
					<button className='btnBG btnBGMain btnBGLitt'
						style={{display: 'inline-block', marginRight: 20, width: 130, borderRadius: 4}}
						onClick={() => {
							self.clickModalOk()
						}}
						>保存</button>
				</article>
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
					onClick={() => self.props.changeType(0)}>科室信息</span>
				<p className='clearfix'></p>
			</div>
		</ModalHeader>
	)
}

const renderDepartmentInfoModal = (self) => {
	const {modalType, titleInfo, departmentSelect, config} = self.props;
	const selectedDepartment = self.props.selectedDepartment || {}
	const detailPage = self.props.detailPage
	const recommandPage = self.props.recommandPage
	const isAppointPage = self.props.isAppointPage
	if (modalType === 'delete') {
		return (
			<div style={{padding: '.3rem .25rem', color: theme.mainfontcolor}}>您确定要删除<span style={{color: theme.maincolor}}>{selectedDepartment.deptName}</span>吗？</div>
		)
	}
	if (modalType === 'modify' || modalType === 'add') {
		let curSelect = config.filter((configItem) => {return configItem.title.indexOf('所属医院') > -1})
		return (
			<div style={{overflow: 'auto', padding: '0 .15rem'}}>
				<ul>
					<li style={{paddingBottom: '.06rem'}}><span className='left'>科室编码：</span>
						{
							modalType === 'add' ?
								<input defaultValue={selectedDepartment.deptSn} ref='deptSnRef' className='left' type='text' />
							:
								<span className='left' ref='deptSnRef'>{selectedDepartment.deptSn}</span>
						}
						<span className='left'></span>
					</li>
					<li><span className='left'>所属机构：</span>
						{
							modalType === 'add' ?
								<select className='left' defaultValue={selectedDepartment.hospitalId} ref={`hospitalIdRef`}>
									{
										curSelect[0].selectData && curSelect[0].selectData.map((departmentSelectItem, deptKey) => {
											return (
												<option value={departmentSelectItem[curSelect[0].valueKey]} key={deptKey}>{departmentSelectItem[curSelect[0].titleKey]}</option>
											)
										})
									}
								</select>
							:
								<span className='left'>{selectedDepartment.hospital && selectedDepartment.hospital.hospitalName}</span>
						}
						<span className='clearfix'></span>
					</li>
					<li><span className='left'>科室名称：</span>
						<input defaultValue={selectedDepartment.deptName} ref='deptNameRef' className='left' type='text' /><span className='clearfix'></span></li>
					<li><span className='left'>科室权重：</span>
						<input defaultValue={selectedDepartment.weight} ref='weightRef' className='left' type='number' /><span className='clearfix'></span></li>
					<li><span className='left'>特色科室：</span>
						<article className='checkboxRow'>
							<input style={{display: 'none'}}
								defaultChecked={selectedDepartment.hot}
										type='checkbox'
										id={`hot`} ref='hotRef' />
							<label style={{top: '2px'}} htmlFor={`hot`}>开启</label>
							<label style={{top: '2px'}} htmlFor={`hot`}>关闭</label>
						</article>
					</li>
					<li style={{display: hosName === 'beiyisanyuan' ? 'none' : 'block'}}><span className='left'>是否可挂号：</span>
						<article className='checkboxRow'>
							<input style={{display: 'none'}}
								defaultChecked={selectedDepartment.isAppointment}
										type='checkbox'
										id={`isAppointment`} ref='isAppointmentRef' />
							<label style={{top: '2px'}} htmlFor={`isAppointment`}>开启</label>
							<label style={{top: '2px'}} htmlFor={`isAppointment`}>关闭</label>
						</article>		
					</li>
					<li><span className='left'>科室位置：</span>
						<input defaultValue={selectedDepartment.position} ref='positionRef' style={{width: '80%'}} className='left' type='text' /><span className='clearfix'></span></li>
					<li style={{height: 'auto'}}><span className='left'>科室介绍：</span>
						<textarea className='left' ref='descriptionRef' defaultValue={selectedDepartment.description}></textarea><span className='clearfix'></span></li>
					<li style={{height: 'auto'}}><span className='left'>科室图片：</span>
						<div className='left'>
							<ImgCard avatar={selectedDepartment.deptPic} />
						</div>
						<span className='clearfix'></span>
					</li>
				</ul>
				<style jsx>{`
					ul{
						padding: .1rem;
					}
					li{
						color: ${theme.mainfontcolor};
						font-size: 12px;
						height: 24px;
						line-height: 24px;
						padding-bottom: ${theme.tbmargin};
					}
					li input, li textarea{
						margin-left: 0;
						background: #f2f2f2;
						line-height: 22px;
						border: 1px solid ${theme.nbordercolor};
						text-indent: 6px;
						border-radius: 2px;
					}
					li textarea{
						width: 80%;
						min-height: .5rem;
					}
				`}</style>
			</div>
		)
	}
}

function mapStateToProps (state) {
  return {
    upTokens: state.qiniu.upTokens,
    loading: state.qiniu.loading,
		error: state.qiniu.error,
		imageFiles: state.qiniu.imageFiles,
		imgBase64: state.qiniu.imgBase64,
		selectedDepartment: state.department.selectedDepartment
  }
}

export default connect(mapStateToProps, { showPrompt, changeImgBase64, selectdepartment })(DepartmentDetailModal)
