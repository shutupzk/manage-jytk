import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard, PageCard} from 'components'
import {ORDERTYPE} from 'config'
import {NEWSINFO} from '../config'
import {ListTitle} from 'modules/common/components'
import {fuzzyQuery, isArray} from 'utils'
import { queryNews, queryHospitals,queryNewGroups, showPrompt,
	createNews,
	updateNews,
	removeNews } from '../../../ducks'
import { connect } from 'react-redux'
import {NewsListItem, NewsDetailModal} from '../components'


class NewsListsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			status: '',
			showModal: false,
			selectedNews: {},
			modalType: '', // add\modify\delete
			page: 1
    }
  }

  componentWillMount() {
		this.queryNews()
		this.props.queryNewGroups(this.props.client)
  }

	async queryNews() {
		let error = await this.props.queryNews(this.props.client, {limit: 10, skip: (this.state.page - 1) * 10})
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
	}
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (modalType === 'modify') {
			values.id = this.state.selectedNews.id
			error = await this.props.updateNews(this.props.client, values)
		}
		else if (modalType === 'add') {
			for (const titleKey in NEWSINFO.news_list_title) {
				const titleItem = NEWSINFO.news_list_title[titleKey] || {}
				if (titleItem.addRequireKey && !values[titleItem.apiKey]) {
					this.props.showPrompt({text: titleItem.title + '必填'})
					return;
				}
			}
			error = await this.props.createNews(this.props.client, values)
			this.setState({page: 1})
		} else if (modalType === 'delete') {
			values.id = this.state.selectedNews.id
			error = await this.props.removeNews(this.props.client, values)
		}
		if (error) {
			this.props.showPrompt({text: error});
			return
		} else {
			this.props.showPrompt({text: '操作成功'});
			this.onHide();
			this.queryNews()
		}
	}

	onHide() {
		this.setState({showModal: false, selectedNews: {}, modalType: ''})
	}

	filterCard(news) {
		let filterNews = news
		if (this.state.keyword) {
			filterNews = fuzzyQuery(filterNews, this.state.keyword, ['title', 'summary'])
		}
		if (this.state.status) {
			filterNews = filterNews.filter((newsItem) => {return newsItem.newsGroup.id === this.state.status})
		}
		return filterNews
	}

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		if (this.props.error) {
			return <div>{this.props.error}</div>
		}
		let news = this.filterCard(this.props.news)
    return (
      <div>
				<FilterCard>
					<SelectFilterCard
						data={this.props.newsGroups}
						status={this.state.status}
						config= {{selectTitle: '全部资讯类型', valueKey: 'id', titleKey: 'type'}}
						changeStatus={(status) => {this.setState({status: status, page: 1}, () => this.queryNews())}} />
					<KeywordCard
						config={{placeholder: '资讯标题／资讯类型'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword, page: 1}, () => this.queryNews())}} />
				</FilterCard>
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加资讯</button>
				</article>
				<ListTitle data={NEWSINFO.news_list_title} />
				{
					news && news.length > 0 ?
						news.map((newsItem, iKey) => {
							return <NewsListItem data={newsItem} key={iKey} index={iKey}
							 titleInfo={NEWSINFO.news_list_title}
							 clickShowModal={(data, modalType) => {this.setState({selectedNews: data, modalType: modalType, showModal: true})}} />
						})
					: 'no data'
				}
				<NewsDetailModal selectedNews={this.state.selectedNews}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={NEWSINFO.news_list_title}
					modalType={this.state.modalType}
					newsGroups={this.props.newsGroups}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
        <PageCard data={isArray(news) ? news : []} page={this.state.page}
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
              this.queryNews()
            })
          }} />
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
		newsGroups: state.news.data.newsGroups
  }
}

export default connect(mapStateToProps, { queryNews, queryHospitals, queryNewGroups, showPrompt, createNews, updateNews, removeNews })(NewsListsScreen)
