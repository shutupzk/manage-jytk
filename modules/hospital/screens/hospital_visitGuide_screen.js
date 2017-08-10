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


class HospitalVisitGuideScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			showModal: false,
			selectedNotice: {},
			modalType: '', // add\modify\delete
			page: 1
    }
  }

  componentWillMount() {
		this.querynotices()
		this.props.queryNoticesGroups(this.props.client)
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
			this.onHide();
			this.props.showPrompt({text: error});
			// return
		}
		this.onHide();
		// await this.props.showPrompt('更新成功');
		this.querynotices()
	}

	onHide() {
		this.setState({showModal: false, selectedNotice: {}, modalType: ''})
	}

	filterCard(notices) {
		let filterNotices = notices
		if (this.state.keyword) {
			filterNotices = fuzzyQuery(filterNotices, this.state.keyword, ['title', 'code', 'content'])
		}
		if (this.state.status) {
			filterNotices = filterNotices.filter((noticeItem) => {return noticeItem.visitNoticeGroup.id === this.state.status})
		}
		return filterNotices
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
		const notices = this.filterCard(this.props.notices)
    return (
      <div>
				<FilterCard>
					<SelectFilterCard
						data={this.props.noticesGroups}
						status={this.state.status}
						config= {{selectTitle: '全部指南类型', valueKey: 'id', titleKey: 'name'}}
						changeStatus={(status) => {this.setState({status: status, page: 1}, () => this.querynotices())}} />
					<KeywordCard
						config={{placeholder: '指南编号／指南名称／指南内容'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword, page: 1}, () => this.querynotices())}} />
				</FilterCard>
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
        <PageCard data={isArray(notices) ? notices : []} page={this.state.page}
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
              this.querynotices()
            })
          }} />
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

export default connect(mapStateToProps, { querynotices, showPrompt, createVisitNotice, updateVisitNotice, queryNoticesGroups })(HospitalVisitGuideScreen)
