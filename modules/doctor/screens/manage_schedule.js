import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERTYPE, DOCTORINFO, HOSPITALINFO, HOSPITAL_NAME} from 'config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryDoctors, showPrompt, createDoctor, updateDoctor } from '../../../ducks'
import { connect } from 'react-redux'
import {ManageListItem, ManageDoctorModal, DoctorDetailModal} from '../components'


class ManageScheduleScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: '', // 空 代表全部
			keyword: '',
			isfilterkeyword: false,
			showModal: false,
			selectedDoctor: {},
			selectedType: 0,
			modalType: ''
    }
  }

  componentWillMount() {
    this.props.queryDoctors(this.props.client)
	}
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (modalType === 'modify') {
			values.id = this.state.selectedDoctor.id
			error = await this.props.updateDoctor(this.props.client, values)
		}
		else if (modalType === 'add') {
			console.log('------add----', values)
			error = await this.props.createDoctor(this.props.client, values)
		}
		if (error) {
			this.onHide();
			this.props.showPrompt({text: error});
			// return
		}
		this.onHide();
		this.props.queryDoctors(this.props.client)
	}

	onHide() {
		this.setState({
			showModal: false,
			selectedDoctor: {}
		})
	}

  filterCard(doctors, isfilterkeyword) {
		const status = this.state.status;
		let newdoctors;
    if (!status) {
			newdoctors = doctors // status 空 代表全部
		} else {
			newdoctors = doctors.filter((item) => item&&item.status === status)
		}
		if (isfilterkeyword && this.state.keyword) {
			// newdoctors  todo filter keyword
			this.setState({
				isfilterkeyword: false
			})
		}
    return newdoctors
  }

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		if (this.props.error) {
			this.props.showPrompt(this.props.error)
			// return console.log(this.props.error)
			return <div>{this.props.error}</div>
		}
		let doctors = this.filterCard(this.props.doctors)
    return (
      <div>
				{
					HOSPITAL_NAME.indexOf('鲁中') > -1 ?
						<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
							<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
								onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加医生</button>
						</article>
					: ''
				}
				{
					HOSPITAL_NAME.indexOf('鲁中') > -1 ?
						<DoctorDetailModal selectedDoctor={this.state.selectedDoctor}
							showModal={this.state.showModal}
							onHide={() => this.onHide()}
							titleInfo={DOCTORINFO.schedule_list_title}
							modalType={this.state.modalType}
							clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
					:
						<ManageDoctorModal selectedDoctor={this.state.selectedDoctor}
							selectedType={this.state.selectedType}
							showModal={this.state.showModal}
							onHide={() => this.setState({showModal: false, selectedType: 0, selectedDoctor: {}})}
							changeType={(type) => this.setState({selectedType: type})}
							pageType={'schedule'}
							typeTitle={DOCTORINFO.modal_type_title} />
				}
				{/* {renderModal(this)} */}
        {/* <TopFilterCard status={this.state.status} changeStatus={(status) => {this.setState({status: status})}}
          changeKeyword={(keyword) => {this.setState({keyword: keyword})}}
					clickfilter={() => this.filterCard(doctors, true)}
					placeholder='医生姓名/专业/亚专业/服务等'
          data={ORDERTYPE} /> */}
        <ListTitle data={DOCTORINFO.schedule_list_title} />
				{
					doctors && doctors.length > 0 ?
						doctors.map((doctor, iKey) => {
							return (
								<div key={iKey}>
									<ManageListItem data={doctor} index={iKey}
										titleInfo={DOCTORINFO.schedule_list_title}
										clickShowModal={(item, modalType) => {this.setState({showModal: true, selectedDoctor: item, modalType: modalType})}} />
								</div>
							)
						})
					: 'no datas'
				}
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    doctors: state.doctor.data,
    loading: state.doctor.loading,
    error: state.doctor.error
  }
}

export default connect(mapStateToProps, { queryDoctors, showPrompt, createDoctor, updateDoctor })(ManageScheduleScreen)
