import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard, PageCard} from 'components'
import {ORDERINFO, DOCTORINFO, HOSPITALINFO, HOSPITAL_NAME} from 'config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import {isArray, fuzzyQuery} from 'utils'
import { queryDoctors, showPrompt, createDoctor, updateDoctor, selectdoctor, changeImgBase64, upsertQuickSchedule, selectFastSchedules } from '../../../ducks'
import { connect } from 'react-redux'
import {ManageListItem, ManageDoctorModal, DoctorDetailModal} from '../components'
import localforage from 'localforage'

class ManageScheduleScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: '', // 空 代表全部
			keyword: '',
			showModal: false,
			selectedType: 0,
			modalType: '',
			page: 1
    }
  }
  componentWillMount() {
    this.queryDoctors()
	}

	async queryDoctors() {
		let params = {limit: 10, skip: (this.state.page - 1) * 10, keyword: this.state.keyword}
		let status = this.state.status
		if (status === 'quikeOpen') {
			params = Object.assign({}, params, {quikeOpen: true})
		}
		if (status === 'imageAndTextOpen') {
			params = Object.assign({}, params, {imageAndTextOpen: true})
		}
		if (status === 'videoOpen') {
			params = Object.assign({}, params, {videoOpen: true})
		}
		let error = await this.props.queryDoctors(
			this.props.client,
			params
		)
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
	}
	
	async clickModalOk(doctor, schedule) {
		// const {workingYears} = doctor
		// if (workingYears < 0) {
		// 	this.props.showPrompt({text: '工作年限不能小于0'})
		// 	return
		// }
		let scheduleError;
		let error
		error = await this.props.updateDoctor(this.props.client, doctor)
		let arraySchedule = []
		for (let key in schedule) {
			arraySchedule.push(schedule[key])
		}
		scheduleError = await this.props.upsertQuickSchedule(this.props.client, {arraySchedule})
		if (error || scheduleError) {
			// this.onHide();
			this.props.showPrompt({text: error || scheduleError});
			return
		}
		// this.onHide();
		// this.props.selectFastSchedules({schedule: {}})
		this.props.changeImgBase64({imgBase64: null})
		this.queryDoctors()
	}

	onHide() {
		this.props.selectdoctor({doctor: {}})
		this.setState({showModal: false, selectedType: 0})
	}

	async changeShowInternet(item, e) {
		let error = await this.props.updateDoctor(this.props.client, {id: item.id, showInternet: e.target.checked})
		if (error) {this.props.showPrompt({text: error}); return;}
		this.queryDoctors()
	}

  render () {
		if (this.props.error) {
			this.props.showPrompt(this.props.error)
			// return console.log(this.props.error)
			return <div>{this.props.error}</div>
		}
		let doctors = this.props.doctors
    return (
      <div>
				{this.props.loading ?
				<Loading showLoading />
				:''
				}
				<FilterCard>
					{
						DOCTORINFO.modal_type_title && DOCTORINFO.modal_type_title[1] ?
							<SelectFilterCard
								data={[{value: 'imageAndTextOpen', title: '开通专家图文问诊'}, {value: 'quikeOpen', title: '开通快速问诊'}, {value: 'videoOpen', title: '开通视频问诊'}]}
								status={this.state.status}
								config= {{selectTitle: '全部类型', valueKey: 'value', titleKey: 'title'}}
								changeStatus={(status) => {
									this.setState({
										page: 1, status: status
									}, () => {
										this.queryDoctors()
									})}
								} />
							: ''
					}
					<KeywordCard
						config={{placeholder: '医生工号／医生姓名', keyword: this.state.keyword}}
						clickfilter={(keyword) => {this.setState({keyword: keyword, page: 1}, () => this.queryDoctors())}} />
				</FilterCard>
				<ManageDoctorModal
					selectedType={this.state.selectedType}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					changeType={(type) => this.setState({selectedType: type})}
					pageType={'schedule'}
					typeTitle={DOCTORINFO.modal_type_title}
					clickModalOk={(doctor, schedule) => this.clickModalOk(doctor, schedule)} />
        <ListTitle data={DOCTORINFO.doctor_info_list_title} />
				{
					doctors && doctors.length > 0 ?
						doctors.map((doctor, iKey) => {
							return (
								<ManageListItem data={doctor} key={iKey} index={iKey}
									titleInfo={DOCTORINFO.doctor_info_list_title}
									changeShowInternet={(item, e) => this.changeShowInternet(item, e)}
									clickShowModal={(item, modalType) => {
										this.props.selectdoctor({doctor: item});
										this.props.selectFastSchedules({schedule: item.doctorSchedules, doctorId: item.id});
										this.setState({showModal: true, modalType: modalType})}} />
							)
						})
					: 'no datas'
				}
        <PageCard data={doctors} page={this.state.page}
          clickPage={(type) => {
            const prevPage = parseInt(this.state.page, 10)
            let curPage
            if (type === 'prev') {
              curPage = prevPage - 1
            } else if (type === 'next') {
              curPage = prevPage + 1
            } else {
              curPage = type
            }
            this.setState({
              page: curPage
            }, () => {
              this.queryDoctors()
            })
          }} />
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    doctors: state.doctor.data,
    loading: state.doctor.loading,
		error: state.doctor.error,
		selectedDoctor: state.doctor.selectedDoctor
  }
}

export default connect(mapStateToProps, { queryDoctors, showPrompt, createDoctor, updateDoctor, selectdoctor, changeImgBase64, upsertQuickSchedule, selectFastSchedules })(ManageScheduleScreen)
