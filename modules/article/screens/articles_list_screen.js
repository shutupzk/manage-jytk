import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, KeywordCard, PageCard} from 'components'
import {ORDERTYPE} from 'config'
import {ARTICLESINFO} from '../config'
import {ListTitle} from 'modules/common/components'
import {fuzzyQuery, isArray} from 'utils'
import { queryArticles, showPrompt, selecteArticle, removeArticle } from '../../../ducks'
import { connect } from 'react-redux'
import {ArticleListItem, ArticleModal} from '../components'


class ArticleListsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			page: 1,
			showDeleteModal: false
    }
  }

  componentWillMount() {
		this.queryArticles()
		this.props.selecteArticle({data: {}})
  }

	async queryArticles() {
		let error = await this.props.queryArticles(this.props.client, {limit: 10, skip: (this.state.page - 1) * 10})
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
	}

	async clickModalOk() {
		const {id} = this.props.selectedArticle
		let error = await this.props.removeArticle(this.props.client, {id})
		if (error) {
			this.onHide()
			this.props.showPrompt({text: error})
			return
		} else {
			this.onHide()
			this.queryArticles()
		}
	}

	onHide() {
		this.setState({showDeleteModal: false})
		this.props.selecteArticle({data: {}})
	}

	filterCard(articles) {
		let filterArticles = articles
		if (this.state.keyword) {
			filterArticles = fuzzyQuery(filterArticles, this.state.keyword, ['code', 'name', 'description'])
		}
		return filterArticles
	}

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		if (this.props.error) {
			return <div>{this.props.error}</div>
		}
		let articles = this.filterCard(this.props.articles)
		const {selectedArticle} = this.props
    return (
      <div>
				<FilterCard>
					<KeywordCard
						config={{placeholder: '编码／标题／内容'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword, page: 1}, () => this.queryArticles())}} />
				</FilterCard>
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => Router.push('/article/article_detail?type=add')}>添加</button>
				</article>
				<ArticleModal showDeleteModal={this.state.showDeleteModal}
					onHide={() => this.onHide()}
					clickModalOk={() => this.clickModalOk()}
					>
					<p style={{padding: '.3rem'}}>您确定要删除<span style={{color: '#f00'}}>{selectedArticle.name}</span>吗？</p>
				</ArticleModal>
				<ListTitle data={ARTICLESINFO.articles_list_title} />
				{
					articles && articles.length > 0 ?
						articles.map((articlesItem, iKey) => {
							return <ArticleListItem data={articlesItem} key={iKey} index={iKey}
							 titleInfo={ARTICLESINFO.articles_list_title}
							 clickShowModal={(data, modalType) => {
								 this.props.selecteArticle({data})
								 if (modalType === 'modify') {
									Router.push(`/article/article_detail?type=modify&id=${data.id}`)
								 } else {
									this.setState({
										showDeleteModal: true
									})
								 }
								}} />
						})
					: 'no data'
				}
        <PageCard data={isArray(articles) ? articles : []} page={this.state.page}
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
              this.queryArticles()
            })
          }} />
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    articles: state.article.data.article,
    loading: state.article.loading,
		error: state.article.error,
		selectedArticle: state.article.selectedArticle
  }
}

export default connect(mapStateToProps, { queryArticles, showPrompt, selecteArticle, removeArticle })(ArticleListsScreen)
