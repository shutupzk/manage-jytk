import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {HOSPITAL_NAME} from 'config'
import {HOSPITALINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { querynotices, showPrompt, createVisitNotice, updateVisitNotice, queryNoticesGroups } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem, HospitalDetailModal} from '../components'


class HospitalVisitGuideScreen extends Component {
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
		this.props.querynotices(this.props.client)
		this.props.queryNoticesGroups(this.props.client)
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
			this.onHide();
			this.props.showPrompt({text: error});
			// return
		}
		this.onHide();
		// await this.props.showPrompt('更新成功');
		await this.props.querynotices(this.props.client)
	}

	onHide() {
		this.setState({showModal: false, selectedNotice: {}, modalType: ''})
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
		console.log('--------this.props', this.props)
    return (
      <div>
				 <article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加就诊指南</button>
				</article> 
				<HospitalDetailModal selectedData={this.state.selectedNotice}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={HOSPITALINFO.hospitalGuide_list_title}
					modalType={this.state.modalType}
					noticesGroups={this.props.noticesGroups}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={HOSPITALINFO.hospitalGuide_list_title} />
				{
					notices && notices.length > 0 ?
						notices.map((noticeItem, iKey) => {
							return <HospitalListItem data={noticeItem} key={iKey} index={iKey}
							 titleInfo={HOSPITALINFO.hospitalGuide_list_title}
							 page='guide'
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
    loading: state.news.loading,
		error: state.news.error,
		hospital: state.hospital.data,
  }
}

export default connect(mapStateToProps, { querynotices, showPrompt, createVisitNotice, updateVisitNotice, queryNoticesGroups })(HospitalVisitGuideScreen)
