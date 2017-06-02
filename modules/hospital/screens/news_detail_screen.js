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
        <div style={styles.container}>
          {
            news.image ? <img style={styles.image} src={news.image} /> : null
          }
          <div style={styles.titleText}>{news.title}</div>
          <div style={styles.timeText}>{news.time}</div>
          <div style={styles.contentText}>{news.content}</div>
        </div>
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

const styles = {
  container: {
    flex: 1
  },
  image: {
    width: '100%',
    height: 150
  },
  titleText: {
    fontSize: 18,
    margin: 10,
    color: '#505050'
  },
  timeText: {
    fontSize: 12,
    marginLeft: 10,
    color: '#B4B4B4'
  },
  contentText: {
    fontSize: 15,
    color: '#505050',
    margin: 10
    // lineHeight: 18
  }
}

export default connect(mapStateToProps, { queryNewsDetail })(NewsDetailScreen)
