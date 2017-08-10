import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard, PageCard} from 'components'
import {ORDERINFO, DOCTORINFO, HOSPITALINFO, HOSPITAL_NAME} from 'config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import {isArray, fuzzyQuery} from 'utils'
import { queryDoctors, showPrompt, createDoctor, updateDoctor } from '../../../ducks'
import { connect } from 'react-redux'
import {ManageListItem, ManageDoctorModal, DoctorDetailModal} from '../components'

class ManageDoctorInfoScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: '', // 空 代表全部
			keyword: '',
			showModal: false,
			selectedDoctor: {},
			modalType: '',
			page: 1
    }
  }
  componentWillMount() {
    this.queryDoctors()
	}

	async queryDoctors() {
		let error = await this.props.queryDoctors(this.props.client, {limit: 10, skip: (this.state.page - 1) * 10})
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
	}
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (modalType === 'modify') {
			values.id = this.state.selectedDoctor.id
			error = await this.props.updateDoctor(this.props.client, Object.assign({}, this.state.selectedDoctor, values))
		}
		else if (modalType === 'add') {
			console.log('------add----', values)
			error = await this.props.createDoctor(this.props.client, values)
			this.setState({page: 1})
		}
		if (error) {
			this.onHide();
			this.props.showPrompt({text: error});
			// return
		}
		this.onHide();
		this.queryDoctors()
	}

	onHide() {
		this.setState({
			showModal: false,
			selectedDoctor: {}
		})
	}

	filterCard(doctor) {
		let filterdoctor = doctor
		if (this.state.keyword) {
			filterdoctor = fuzzyQuery(filterdoctor, this.state.keyword, ['doctorName', 'doctorSn'])
		}
		return filterdoctor
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
		// let doctors = []
    return (
      <div>
				<FilterCard>
					<KeywordCard
						config={{placeholder: '医生工号／医生姓名', keyword: this.state.keyword}}
						clickfilter={(keyword) => {this.setState({keyword: keyword, page: 1}, () => this.queryDoctors())}} />
				</FilterCard>
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加医生</button>
				</article>
				<DoctorDetailModal selectedDoctor={this.state.selectedDoctor}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={DOCTORINFO.doctor_info_list_title}
					modalType={this.state.modalType}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				{/* {renderModal(this)} */}
        {/* <TopFilterCard status={this.state.status} changeStatus={(status) => {this.setState({status: status})}}
          changeKeyword={(keyword) => {this.setState({keyword: keyword})}}
					clickfilter={() => this.filterCard(doctors, true)}
					placeholder='医生姓名/专业/亚专业/服务等'
          data={ORDERINFO.order_type} /> */}
        <ListTitle data={isArray(DOCTORINFO.doctor_info_list_title) ? DOCTORINFO.doctor_info_list_title : []} />
				{
					doctors && doctors.length > 0 ?
						doctors.map((doctor, iKey) => {
							return (
								<ManageListItem data={doctor} key={iKey} index={iKey + ((this.state.page -1)*10)}
									titleInfo={isArray(DOCTORINFO.doctor_info_list_title) ? DOCTORINFO.doctor_info_list_title : []}
									clickShowModal={(item, modalType) => {this.setState({showModal: true, selectedDoctor: item, modalType: modalType})}} />
							)
						})
					: 'no datas'
				}
        <PageCard data={doctors} page={this.state.page}
          clickPage={(type) => {
            const prevPage = this.state.page
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
    error: state.doctor.error
  }
}

export default connect(mapStateToProps, { queryDoctors, showPrompt, createDoctor, updateDoctor })(ManageDoctorInfoScreen)
