import React, { Component } from 'react'
import { connect } from 'react-redux'

import { queryNewsDetail } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
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
        <div>loading...</div>
      )
    }
    if (this.props.error) {
      return (
        <div>error...</div>
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
          <div className={'titleText'}>{news.title}</div>
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
            padding: 10px;
            color: #505050;
          }
          .timeText {
            font-size: 12px;
            padding-left: 10px;
            color: #B4B4B4;
          }
          .contentText {
            font-size: 14px;
            color: #505050;
            padding: 15px;
            margin-top: 5px;
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
