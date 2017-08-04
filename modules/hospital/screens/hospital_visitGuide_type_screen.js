import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard} from 'components'
import {fuzzyQuery, isArray} from 'utils'
import {HOSPITALINFO} from '../config'
import {ListTitle} from 'modules/common/components'
import { queryHospitals, showPrompt, createNoticesGroups, updateNoticesGroups, queryNoticesGroups } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem, HospitalDetailModal} from '../components'


class HospitalVisitGuideTypeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			showModal: false,
			selectedNotice: {},
			modalType: '', // add\modify\delete
			isfilterkeyword: false
    }
  }

  componentWillMount() {
		this.props.queryHospitals(this.props.client)
		this.props.queryNoticesGroups(this.props.client)
  }
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (modalType === 'modify') {
			values.id = this.state.selectedNotice.id
			error = await this.props.updateNoticesGroups(this.props.client, values)
		}
		else if (modalType === 'add') {
			error = await this.props.createNoticesGroups(this.props.client, values)
		}
		if (error) {
			this.onHide();
			this.props.showPrompt({text: error});
			// return
		}
		this.onHide();
		// await this.props.showPrompt('更新成功');
		await this.props.queryNoticesGroups(this.props.client)
	}

	onHide() {
		this.setState({showModal: false, selectedNotice: {}, modalType: ''})
	}

	filterCard(noticesGroups) {
		let filterNoticesGroups = noticesGroups
		if (this.state.keyword) {
			filterNoticesGroups = fuzzyQuery(filterNoticesGroups, this.state.keyword, ['title', 'code', 'content'])
		}
		if (this.state.status) {
			filterNoticesGroups = filterNoticesGroups.filter((noticeItemGroups) => {return noticeItemGroups.hospital.id === this.state.status})
		}
		return filterNoticesGroups
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
		console.log('===this.props.hospital', this.props.hospital)
		const noticesGroups = this.filterCard(this.props.noticesGroups)
    return (
      <div>
				 <FilterCard>
					 <SelectFilterCard
						data={isArray(this.props.hospital) ? this.props.hospital : []}
						status={this.state.status}
						config= {{selectTitle: '全部医院', valueKey: 'id', titleKey: 'hospitalName'}}
						changeStatus={(status) => {this.setState({status: status})}} /> 
					{/* <KeywordCard
						config={{placeholder: '指南编号／指南名称／指南内容'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword})}} /> */}
				</FilterCard> 
				 <article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加就诊指南</button>
				</article> 
				<HospitalDetailModal selectedData={this.state.selectedNotice}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={HOSPITALINFO.hospitalGuide_type_list_title}
					modalType={this.state.modalType}
					hospital={this.props.hospital}
					page={'guideType'}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={HOSPITALINFO.hospitalGuide_type_list_title} />
				{
					noticesGroups && noticesGroups.length > 0 ?
						noticesGroups.map((noticeItem, iKey) => {
							return <HospitalListItem data={noticeItem} key={iKey} index={iKey}
							 titleInfo={HOSPITALINFO.hospitalGuide_type_list_title}
							 page='guideType'
							 clickShowModal={(data, modalType) => {this.setState({selectedNotice: data, modalType: modalType, showModal: true})}} />
						})
					: 'no data'
				}
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    notices: state.notices.data.notices,
    noticesGroups: state.notices.data.noticesGroups,
    loading: state.notices.loading,
		error: state.notices.error,
		hospital: state.hospital.data,
  }
}

export default connect(mapStateToProps, { queryHospitals, showPrompt, createNoticesGroups, updateNoticesGroups, queryNoticesGroups })(HospitalVisitGuideTypeScreen)