import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, DraftCard} from 'components'
import {ORDERTYPE} from 'config'
import {HOSPITALINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryHospital, showPrompt, createHospital, updateHospital } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem, HospitalDetailPage} from '../components'

class HospitalIntroDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
		}
  }

  componentWillMount() {
		const {id, type} = this.props.url && this.props.url.query || {}
		if (type === 'modify') {
			this.props.queryHospital(this.props.client, {id})
		}
	}
	
	async clickModalOk(values) {
		let error;
		const {type, id} = this.props.url && this.props.url.query || {}
		if(type === 'modify') {
			error = await this.props.updateHospital(this.props.client, Object.assign({}, values, {id}))
		}
		else if (type === 'add') {
			error = await this.props.createHospital(this.props.client, values)
		}
		if (error) {
			this.props.showPrompt({text: error});
			// return
		}
		await this.props.showPrompt('更新成功');
		Router.push('/hospital/hospital_introduct')
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
		let hospital = this.props.hospital
    return (
      <div>
				<HospitalDetailPage selectedData={this.props.selectedHospital}
					showModal={true}
					titleInfo={HOSPITALINFO.hospitalInfo_list_title}
					modalType={'modify'}
					newsGroups={this.props.newsGroups}
					clickModalOk={(values) => this.clickModalOk(values)} />
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    news: state.news.data.news,
    loading: state.news.loading,
		error: state.news.error,
		hospital: state.hospital.data,
		newsGroups: state.news.data.newsGroups,
		selectedHospital: state.hospital.selectedHospital
  }
}

export default connect(mapStateToProps, { queryHospital, showPrompt, createHospital, updateHospital })(HospitalIntroDetailScreen)
