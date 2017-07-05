import React, { Component } from 'react'
import { connect } from 'react-redux'

import { queryNewsDetail } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
import {theme, Loading, ErrCard} from 'components'
const filterNews = (newses, selectNewsId) => {
  let news = newses.filter((news) => {
    if (selectNewsId === news.id) {
      return true
    }
    return false
  })
  return news[0]
}

class NewsDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false
    }
  }
  componentWillMount () {
    if (!this.props.newses || isEmptyObject(this.props.newses)) {
      this.setState({isInit: true})
      this.queryNewsDetail()
    }
  }
  async queryNewsDetail () {
    await this.props.queryNewsDetail(this.props.client, {newsId: this.props.url.query.newsId})
    this.setState({isInit: false})
  }
  render () {
    if (this.props.loading || this.state.isInit) {
      return (
        <div><Loading showLoading={true} /></div>
      )
    }
    if (this.props.error) {
      return (
        <div><ErrCard /></div>
      )
    }
    let newses = this.props.newses
    let newsGroupId = this.props.selectId.newsGroupId || this.props.url.query.newsGroupId
    let newsId = this.props.selectId.newsId || this.props.url.query.newsId
    let news = filterNews(newses[newsGroupId].newss, newsId)
    return (
      <div >
        <div style={{backgroundColor: '#fff'}}>
          {
            news.image ? <img className={'image'} src={news.image} /> : null
          }
          <div className={'titleText textoverflow1'}>{news.title}</div>
          <div className={'timeText'}>{news.time}</div>
          <div className={'contentText'}>{news.content}</div>
        </div>
        <style jsx>{`
          .image {
            width: 100%;
            height: 150px;
          }
          .titleText {
            font-size: 18px;
            padding: ${theme.lrmargin} ${theme.lrmargin} 0;
            color: ${theme.mainfontcolor};
          }
          .timeText {
            font-size: ${theme.nfontsize};
            padding: 10px 15px 0;
            color: ${theme.nfontcolor};
            text-align: right;
          }
          .contentText {
            font-size: 14px;
            color: ${theme.fontcolor};
            padding: 10px 15px 15px;
            line-height: .26rem;
            text-indent: 2em;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    selectId: state.news.selectId,
    newses: state.news.data,
    loading: state.news.loading,
    error: state.news.error
  }
}

export default connect(mapStateToProps, { queryNewsDetail })(NewsDetailScreen)
