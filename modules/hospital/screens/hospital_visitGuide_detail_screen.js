import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard, PageCard} from 'components'
import {fuzzyQuery, isArray} from 'utils'
import {HOSPITALINFO} from '../config'
import {ListTitle} from 'modules/common/components'
import { querynotices, showPrompt, createVisitNotice, updateVisitNotice, queryNoticesGroups } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem, HospitalDetailModal} from '../components'


class HospitalVisitGuideDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
		this.querynotices()
	}
	
	async querynotices() {
		let error = await this.props.querynotices(this.props.client, {limit: 10, skip: (this.state.page - 1) * 10})
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
	}
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (modalType === 'modify') {
			values.id = this.state.selectedNotice.id
			error = await this.props.updateVisitNotice(this.props.client, values)
		}
		else if (modalType === 'add') {
			error = await this.props.createVisitNotice(this.props.client, values)
		}
		if (error) {
			this.props.showPrompt({text: error});
			// return
		}
		// await this.props.showPrompt('更新成功');
		this.querynotices()
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
		const notices = this.props.notices
    return (
      <div>
				<HospitalDetailModal selectedData={this.state.selectedNotice}
					showModal={true}
					titleInfo={HOSPITALINFO.hospitalGuide_list_title}
					modalType={this.state.modalType}
					noticesGroups={this.props.noticesGroups}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
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

export default connect(mapStateToProps, { querynotices, showPrompt, createVisitNotice, updateVisitNotice, queryNoticesGroups })(HospitalVisitGuideDetailScreen)
