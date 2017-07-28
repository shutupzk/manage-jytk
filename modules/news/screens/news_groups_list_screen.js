import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard} from 'components'
import {ORDERTYPE} from 'config'
import {NEWSINFO} from '../config'
import {ListTitle} from 'modules/common/components'
import { queryHospitals,queryNewGroups, showPrompt,
	createGroups,
	updateNewsGroup,
	removeNewsGroup } from '../../../ducks'
import { connect } from 'react-redux'
import {NewsListItem, NewsDetailModal} from '../components'


class NewsGroupListsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			status: '',
			showModal: false,
			selectedNews: {},
			modalType: '', // add\modify\delete
    }
  }

  componentWillMount() {
		this.props.queryHospitals(this.props.client)
		this.props.queryNewGroups(this.props.client)
  }
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (modalType === 'modify') {
			values.id = this.state.selectedNews.id
			error = await this.props.updateNewsGroup(this.props.client, values)
		}
		else if (modalType === 'add') {
			for (const titleKey in NEWSINFO.news_groups_list_title) {
				const titleItem = NEWSINFO.news_groups_list_title[titleKey] || {}
				if (titleItem.addRequireKey && !values[titleItem.apiKey]) {
					this.props.showPrompt({text: titleItem.title + '必填'})
					return;
				}
			}
			error = await this.props.createGroups(this.props.client, values)
		} else if (modalType === 'delete') {
			values.id = this.state.selectedNews.id
			error = await this.props.removeNewsGroup(this.props.client, values)
		}
		if (error) {
			this.props.showPrompt({text: error});
			return
		}
		this.onHide();
		await this.props.queryNewGroups(this.props.client, {forceFetch: true})
	}

	onHide() {
		this.setState({showModal: false, selectedNews: {}, modalType: ''})
	}
  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		if (this.props.error) {
			return <div>{this.props.error}</div>
		}
		let newsGroups = this.props.newsGroups
    return (
      <div>
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加资讯类型</button>
				</article>
				<ListTitle data={NEWSINFO.news_groups_list_title} />
				{
					newsGroups && newsGroups.length > 0 ?
						newsGroups.map((newsGroupsItem, iKey) => {
							return <NewsListItem data={newsGroupsItem} key={iKey} index={iKey}
							 titleInfo={NEWSINFO.news_groups_list_title}
							 clickShowModal={(data, modalType) => {this.setState({selectedNews: data, modalType: modalType, showModal: true})}} />
						})
					: 'no data'
				}
				<NewsDetailModal selectedNews={this.state.selectedNews}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={NEWSINFO.news_groups_list_title}
					modalType={this.state.modalType}
					newsGroups={this.props.hospital}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    loading: state.news.loading,
		error: state.news.error,
		hospital: state.hospital.data,
		newsGroups: state.news.data.newsGroups
  }
}

export default connect(mapStateToProps, { queryHospitals, queryNewGroups, showPrompt, createGroups, updateNewsGroup, removeNewsGroup })(NewsGroupListsScreen)
