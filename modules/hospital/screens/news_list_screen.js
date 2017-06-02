import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import {
  queryNewsGroups,
  queryNews,
  selectNews
} from '../../../ducks'
import NewsItem from '../components/news_item'
class NewsListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      groupId: null
    }
  }
  componentWillMount () {
    this.queryNews()
  }

  async queryNews () {
    this.setState({isInit: true})
    await this.props.queryNewsGroups(this.props.client)
    let newses = this.props.newses
    let newNewses = this.getNewses(newses) || []
    if (newNewses.length > 0) {
      this.setState({groupId: newNewses[0].id})
      this.props.queryNews(this.props.client, {groupId: newNewses[0].id})
    }
    this.setState({isInit: false})
  }
  getNewses (newses) {
    let newNewses = []
    for (let news in newses) {
      newNewses.push(newses[news])
    }
    return newNewses
  }
  gotoDetail (news) {
    selectNews({newsGroupId: this.state.groupId, newsId: news.id})
    Router.push('/hospital/news_detail?newsId=' + news.id + '&newsGroupId=' + this.state.groupId)
  }
  renderNew (selectNews) {
    let newss = this.props.newses[this.state.groupId].newss
    if (newss && newss.length > 0) {
      return (
        <div>
          {
            newss.map((item) => {
              return (
                <div key={item.id}>
                  <NewsItem news={item} gotoDetail={(news) => { this.gotoDetail(news) }} />
                </div>
              )
            })
          }
        </div>
      )
    } else {
      return <div>no data</div>
    }
  }
  render () {
    console.log(this.props.newses)
    if (this.props.loading || this.state.isInit) {
      return (
        <div>
          <div>loading...</div>
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <div>error...</div>
        </div>
      )
    }
    let newses = this.props.newses
    let newNewses = this.getNewses(newses)
    if (newNewses.length > 0) {
      return (
        <div>
          <div style={{display: 'flex', padding: '10px', backgroundColor: '#ffffff', border: 'solid 1px #eeeeee'}}>{
            newNewses.map((item, i) => {
              return (
                <div key={i} onClick={() => {
                  if (!newNewses[i].newss || newNewses[i].newss.length === 0) {
                    this.props.queryNews(this.props.client, {groupId: newNewses[i].id})
                  }
                  this.setState({groupId: newNewses[i].id})
                }} style={{width: '25%', textAlign: 'center'}}>{item.type}</div>
              )
            })
          }</div>
          {
            this.renderNew(this.props.selectNews)
          }
        </div>
      )
    } else {
      return (<div>no data</div>)
    }
  }
}

function mapStateToProps (state) {
  return {
    newses: state.news.data,
    loading: state.hospitals.loading,
    error: state.hospitals.error
  }
}

export default connect(mapStateToProps, {
  queryNewsGroups,
  queryNews,
  selectNews
})(NewsListScreen)
