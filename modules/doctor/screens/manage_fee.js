import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard} from 'components'
import {ORDERINFO, DOCTORINFO, HOSPITALINFO} from 'config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import {fuzzyQuery} from 'utils'
import { queryDoctors, showPrompt, updateDoctor } from '../../../ducks'
import { connect } from 'react-redux'
import {ManageListItem, ManageDoctorModal} from '../components'


class ManageFeeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: '', // 空 代表全部
			keyword: '',
			isfilterkeyword: false,
			showModal: false,
			selectedDoctor: {},
			selectedType: 0
    }
  }
// , quikePrice, imageAndTextPrice, videoPrice
  componentWillMount() {
    this.props.queryDoctors(this.props.client)
  }
	
	async clickModalOk(values) {
		let error;
		values.id = this.state.selectedDoctor.id
		error = await this.props.updateDoctor(this.props.client, Object.assign({}, this.state.selectedDoctor, values))
		if (error) {
			this.onHide();
			this.props.showPrompt({text: error});
			return
		}
		this.onHide();
		this.props.queryDoctors(this.props.client)
	}

	onHide() {
		this.setState({showModal: false, selectedType: 0, selectedDoctor: {}})
	}

  filterCard(doctors) {
		let filterDoctors = doctors
		if (this.state.keyword) {
			filterDoctors = fuzzyQuery(filterDoctors, this.state.keyword, ['doctorName', 'doctorSn'])
		}
		if (this.state.status) {
			filterDoctors = filterDoctors.filter((doctorItem) => {return doctorItem.newsGroup.id === this.state.status})
		}
		return filterDoctors
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
				{/* {renderModal(this)} */}
				<ManageDoctorModal selectedDoctor={this.state.selectedDoctor}
					selectedType={this.state.selectedType}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					changeType={(type) => this.setState({selectedType: type})}
					pageType={'fee'}
					typeTitle={DOCTORINFO.modal_type_title}
					clickModalOk={(values) => this.clickModalOk(values)} />
				<FilterCard>
					<KeywordCard
						config={{placeholder: '医生姓名/医生工号'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword})}} />
				</FilterCard>
        <ListTitle data={DOCTORINFO.fee_list_title} style={{padding: '2px 15px'}} />
				{
					doctors && doctors.length > 0 ?
						doctors.map((doctor, iKey) => {
							return (
								<ManageListItem data={doctor} index={iKey} key={iKey}
									titleInfo={DOCTORINFO.fee_list_title}
									clickShowModal={(item) => {this.setState({showModal: true, selectedDoctor: item})}} />
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

export default connect(mapStateToProps, { queryDoctors, showPrompt, updateDoctor })(ManageFeeScreen)
