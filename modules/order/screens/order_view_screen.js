import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, KeywordCard, PageCard} from 'components'
import {ORDERTYPE} from 'config'
import {ListTitle} from 'modules/common/components'
import {fuzzyQuery, isArray} from 'utils'
import { queryArticles, showPrompt, selecteArticle, removeArticle } from '../../../ducks'
import { connect } from 'react-redux'


class OrderViewScreen extends Component {
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

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		if (this.props.error) {
			return <div>{this.props.error}</div>
		}
		const {selectedArticle} = this.props
    return (
      <div>
				<p></p>
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

export default connect(mapStateToProps, { queryArticles, showPrompt, selecteArticle, removeArticle })(OrderViewScreen)
