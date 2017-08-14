import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Loading} from 'components'
import {ARTICLESINFO} from '../config'
import { queryHospital, showPrompt, createArticle, updateArticle } from '../../../ducks'
import { connect } from 'react-redux'
import {ArticleDetailPage} from '../components'

class ArticleDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
		}
  }

  componentWillMount() {
		// const {id, type} = this.props.url && this.props.url.query || {}
		// if (type === 'modify') {
		// 	this.props.queryHospital(this.props.client, {id})
		// }
	}
	
	async clickModalOk(values) {
		let error;
		const {type, id} = this.props.url && this.props.url.query || {}
		if(type === 'modify') {
			error = await this.props.updateArticle(this.props.client, Object.assign({}, values, {id}))
		}
		else if (type === 'add') {
			if (!values.code) {
				this.props.showPrompt({text: '编码必填'})
				return
			}
			if (!values.name) {
				this.props.showPrompt({text: '名称必填'})
				return
			}
			error = await this.props.createArticle(this.props.client, values)
		}
		if (error) {
			this.props.showPrompt({text: error});
			// return
		}
		await this.props.showPrompt({text: '更新成功'});
		Router.push('/article')
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
		const {type} = this.props.url && this.props.url.query || {}
    return (
      <div>
				<ArticleDetailPage selectedData={this.props.selectedArticle}
					titleInfo={ARTICLESINFO.articles_list_title}
					modalType={type}
					clickModalOk={(values) => this.clickModalOk(values)} />
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    loading: state.article.loading,
		error: state.article.error,
		selectedArticle: state.article.selectedArticle
  }
}

export default connect(mapStateToProps, { queryHospital, showPrompt, createArticle, updateArticle })(ArticleDetailScreen)
