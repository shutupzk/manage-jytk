import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter, ImgCard} from 'components'
import Link from 'next/link'
import {sex, isEmptyObject} from 'utils'
import { connect } from 'react-redux'
import {ORDERTYPE, DOCTORINFO, HOSPITALINFO, HOSPITAL_NAME} from 'config'
import {tableTh, apTh, serviceCon, doctorInfo} from '../config'
// qiniu
import request from 'superagent-bluebird-promise'
import {showPrompt, changeImgBase64, selectdoctor, selectFastSchedules} from '/ducks'

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

class ManageDoctorModal extends Component {
  constructor (props) {
		super(props)
    var uploadUrl = 'http://upload.qiniu.com'
    if (process.browser && window.location.protocol === 'https:') {
      uploadUrl = 'https://up.qbox.me/'
		}
    this.state = {
			videoSchedules: [],
			todo: '',
			maxSize: '10M',
			uploadUrl: uploadUrl,
			workingYears: props.selectedDoctor && props.selectedDoctor.workingYears || null
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
					_this.props.selectdoctor({doctor: Object.assign({}, _this.props.selectedDoctor, {avatar: img})})
					_this.props.clickModalOk(Object.assign({}, _this.props.selectedDoctor, {avatar: img}), _this.props.selectedFastSchedules) 
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
		const {workingYears, imageAndTextPrice, quikePrice} = this.props.selectedDoctor
		if (workingYears < 0) {
			this.props.showPrompt({text: '工作年限不能小于0'})
			return
		}
		if (imageAndTextPrice < 0 || quikePrice < 0) {
			this.props.showPrompt({text: '费用不能小于0'})
			return
		}
		{/* 点击确定， 图片上传七牛云 检验base64是否存在，如果存在就说明需要上传七牛云 */}
		if (this.props.imgBase64) {
			this.uploadFiles()
		} else {
			this.props.clickModalOk(this.props.selectedDoctor, this.props.selectedFastSchedules)
		}
	}
	
  render () {
    return (
			<div>{renderModal(this)}</div>
    )
  }
}

const renderModal = (self) => {
	const {selectedDoctor, selectedType, pageType} = self.props;
	return (
		<Modal showModalState={self.props.showModal} style={{top: '9%'}}>
			{modalHeaderView(self)}
			{
				selectedType === 1 ?
					renderServiceModal(self)
				: renderDoctorInfoModal(self)
			}
			<ModalFooter>
				<article style={{width: '100%',textAlign: 'right', lineHeight: '46px'}}>
					<button className='btnBG btnBGMain btnBGLitt'
						style={{display: 'inline-block', marginRight: 20, width: 130, borderRadius: 4}}
						onClick={() => {
							self.clickModalOk()
						}}
						>确定</button>
				</article>
			</ModalFooter>
		</Modal>
	)
}

const renderDoctorInfoModal = (self) => {
	const modalHeight = process.browser? document && document.body.clientWidth * 0.4 : 500
	const selectedDoctor = self.props.selectedDoctor || {};
	const department = selectedDoctor.departmentHasDoctors && selectedDoctor.departmentHasDoctors[0] && selectedDoctor.departmentHasDoctors[0].department && selectedDoctor.departmentHasDoctors[0].department || {}
	return (
		<div style={{height: modalHeight, overflow: 'auto', padding: '0 .15rem'}}>
			<div style={{padding: '.1rem 0', width: '80%', borderBottom: `1px solid ${theme.nbordercolor}`}} className='flex'>
				<div style={{marginLeft: '.1rem'}}><ImgCard avatar={selectedDoctor.avatar} /></div>
				<section style={{color: theme.mainfontcolor, fontSize: 12, paddingLeft: theme.tbmargin}}>
					<article><strong style={{paddingRight: '.06rem', fontSize: 14}}>{selectedDoctor.doctorName}</strong>{selectedDoctor.sex ? sex(selectedDoctor.sex) : ''}</article>
					<article>{department.deptName} {selectedDoctor.title ? <span><span style={{padding: '0 .06rem'}}>|</span>{selectedDoctor.title}</span> : ''}</article>
					<article><span style={{paddingRight: '.06rem'}}>医生工号</span>{selectedDoctor.doctorSn}</article>
				</section>
			</div>
			<div className='flex tb-flex' style={{color: theme.mainfontcolor, fontSize: 12, padding: '.15rem .1rem'}}>
				<dl className='flex tb-flex'>
					<dt className='checkbox'>
						<input type="checkbox" id='hotDoctor' onChange={(e) => {
						self.props.selectdoctor({doctor: Object.assign({}, self.props.selectedDoctor, {hot: e.target.checked})})
					}} defaultChecked={selectedDoctor.hot} ref={'hotRef'} /><label htmlFor='hotDoctor'></label>
					</dt>
					<dd style={{paddingLeft: '.04rem', paddingRight: '.2rem'}}>热门医生</dd>
				</dl>
				<dl className='flex tb-flex'>
					<dt className='checkbox'>
						<input type="checkbox" id='recommandDoctor' onChange={(e) => {
						self.props.selectdoctor({doctor: Object.assign({}, self.props.selectedDoctor, {recommend: e.target.checked})})
					}} defaultChecked={selectedDoctor.recommend} /><label htmlFor='recommandDoctor'></label>
					</dt>
					<dd style={{paddingLeft: '.04rem'}}>推荐</dd>
				</dl>
			</div>
			<ul>
				<li><span className='left'>联系电话</span>
					<input onChange={(e) => {self.props.selectdoctor({doctor: Object.assign({}, self.props.selectedDoctor, {phone: e.target.value})})}} defaultValue={selectedDoctor.phone} className='left' type='text' /><span className='clearfix'></span></li>
				<li><span className='left'>工作年限</span>
					<input min='0' onChange={(e) => {
						self.props.selectdoctor({doctor: Object.assign({}, self.props.selectedDoctor, {workingYears: parseInt(e.target.value, 10)})})
					}} className='left' type='number' defaultValue={selectedDoctor.workingYears} /><span className='clearfix'></span></li>
				<li><span className='left'>专业特长</span>
					<textarea className='left' onChange={(e) => {
						self.props.selectdoctor({doctor: Object.assign({}, self.props.selectedDoctor, {major: e.target.value})})
					}} defaultValue={selectedDoctor.major}></textarea><span className='clearfix'></span></li>
				<li><span className='left'>获奖情况</span>
					<textarea className='left' onChange={(e) => {
						self.props.selectdoctor({doctor: Object.assign({}, self.props.selectedDoctor, {prizes: e.target.value})})
					}} defaultValue={selectedDoctor.prizes}></textarea><span className='clearfix'></span></li>
				<li><span className='left'>工作经历</span>
					<textarea className='left' onChange={(e) => {
						self.props.selectdoctor({doctor: Object.assign({}, self.props.selectedDoctor, {workExperience: e.target.value})})
					}} defaultValue={selectedDoctor.workExperience}></textarea><span className='clearfix'></span></li>
			</ul>
			<style jsx>{`
				ul{
					padding: 0 .1rem;
				}
				li{
					color: ${theme.mainfontcolor};
					font-size: 12px;
					line-height: 22px;
					padding-bottom: ${theme.tbmargin};
				}
				li input, li textarea{
					margin-left: ${theme.midmargin};
					background: #f2f2f2;
					line-height: 20px;
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
			onHide={() => {self.props.changeImgBase64({imgBase64: null});self.props.onHide()}}>
			<div style={{borderBottom: `1px solid ${theme.bordercolor}`, width:'80%', fontSize: theme.nfontsize, color: theme.nfontcolor}}>
				{
					typeTitle && typeTitle.map((typeTitleItem) => {
						return (
							<span key={typeTitleItem.value} className='left'
								style={self.props.selectedType === typeTitleItem.value ? curHaderItemStyle : headerItemStyle}
								onClick={() => {
									self.props.changeType(typeTitleItem.value)}
								}>{typeTitleItem.title}</span>
						)
					})
				}
				<p className='clearfix'></p>
			</div>
		</ModalHeader>
	)
}

const renderServiceModal = (self) => {
	const modalHeight = process.browser? document.body.clientWidth * 0.4 : 500
	const {selectedDoctor, selectedType, pageType} = self.props;
	return (
		<div style={{height: modalHeight, overflow: 'auto', padding: `${theme.tbmargin} .25rem`}}>
			{
				serviceCon.map((item, index) => {
					return (
						<div style={{padding: '.1rem 0',color: theme.mainfontcolor}} key={index}>
							<header style={{ fontSize: theme.nfontsize, paddingBottom: theme.tbmargin}} className='flex tb-flex'>
								<article className='checkbox'>
									<input type="checkbox" id={`service${index}`} onChange={(e) => {
									self.props.selectdoctor({doctor: Object.assign({}, self.props.selectedDoctor, {[item.openApiKey]: e.target.checked})})
								}} defaultChecked={selectedDoctor[item.openApiKey] || false} />
									<label htmlFor={`service${index}`}></label>
								</article>
								<strong style={{fontSize: 14, padding: `0 ${theme.tbmargin}`}}>{item.title}</strong>
								已服务&nbsp;<span style={{color: theme.maincolor}}>{selectedDoctor[item.servicetotalApiKey]}</span>&nbsp;单
							</header>
							<article className='flex tb-flex' style={{fontSize: 12, paddingLeft: 24}}>
								收取费用&nbsp;&nbsp;
								<input type='number' onChange={(e) => {
									self.props.selectdoctor({doctor: Object.assign({}, self.props.selectedDoctor, {[item.priceApiKey]: parseInt(e.target.value, 10)})})
								}} defaultValue={selectedDoctor[item.priceApiKey]} style={{background: '#F2F2F2', border: `1px solid ${theme.bordercolor}`, lineHeight: '18px', width: 60, borderRadius: 2}} />
								&nbsp;&nbsp;元/次
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

const tableView = (self) => {
	const selectedFastSchedules = self.props.selectedFastSchedules || {}
	const selectedDoctor = self.props.selectedDoctor || {}
	return (
		<table className='left' style={{cellPadding: 0, borderSpacing: 0, paddingRight: theme.lrmargin}}>
			<tbody>
			<tr className='flex'>
				{
					tableTh.map((item, iKey) => {
						return (
							<th className='flex tb-flex lr-flex' style={{background: '#E8EEFA', lineHeight: '20px', width: item.width}} key={iKey}>
								{item.title}
								<i style={{height: '21px'}}></i>
							</th>
						)
					})
				}
			</tr>
			{
				apTh.map((time, index) => {
					return (
						<tr key={index} className='flex'>
							{
								tableTh.map((item, iKey) => {
									if (iKey === 0) {
										return (
											<td className='flex tb-flex lr-flex' style={{width: item.width, height: item.height}} key={iKey}>{time.title}<i></i></td>
										)
									} else {
										return (
											<td className='flex tb-flex lr-flex' style={{width: item.width, height: item.width}} key={iKey}
												onClick={() => {
													const prevSchedule = selectedFastSchedules[item.value+time.value] || {}
													let newSchedule = {week: item.value, ampm: time.value, channel: !prevSchedule.channel, doctorId: selectedDoctor.id}
													self.props.selectFastSchedules({schedule: 
														Object.assign({}, 
															self.props.selectedFastSchedules,
															{[item.value + time.value]: newSchedule})
														})
												}}>
												{
													selectedFastSchedules[item.value+time.value] && selectedFastSchedules[item.value+time.value].channel ?
														<img src={`/static/${HOSPITALINFO.hospital_short_name}/pass2.png`} style={{ width: 18}} />
													: ''
												}
												{/*   */}
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
			</tbody>
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
						<input type='number' style={{width: '100%', textAlign: 'center'}} value={self.state.videoTime.number}
							onChange={(e) => {
								const prevVideoTime = self.state.videoTime
								self.setState({
									videoTime: Object.assign({}, prevVideoTime, {number: e.target.value})
								})
							}} />
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

const renderFastSchedule = (self) => {
	return (
		<div style={{ marginTop: theme.lrmargin, paddingLeft: 24}}>{tableView(self, 'fast')}<div className='clearfix'></div></div>
	)
}

function mapStateToProps (state) {
  return {
    upTokens: state.qiniu.upTokens,
    loading: state.qiniu.loading,
		error: state.qiniu.error,
		imageFiles: state.qiniu.imageFiles,
		imgBase64: state.qiniu.imgBase64,
		selectedDoctor: state.doctor.selectedDoctor,
		selectedFastSchedules: state.schedule.selectedFastSchedules
  }
}

export default connect(mapStateToProps, { showPrompt, changeImgBase64, selectdoctor, selectFastSchedules })(ManageDoctorModal)
