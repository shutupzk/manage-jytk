import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import {
  queryNewsGroups,
  queryNews,
  selectNews
} from '../../../ducks'
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
  renderNew (selectNews) {
    let newss = this.props.newses[this.state.groupId].newss
    console.log(newss)
    console.log(this.state.groupId)
    if (newss && newss.length > 0) {
      return (
        <div>
          {
            newss.map((item) => {
              let imagUrl = item.image ? item.image : '/static/icons/doctor_head.png'
              return (
                <div key={item.id} onClick={() => {
                  selectNews({newsGroupId: this.state.groupId, newsId: item.id})
                  Router.push('/hospital/news_detail?newsId=' + item.id + '&newsGroupId=' + this.state.groupId)
                }}>
                  <div style={styles.itemView}>
                    <img src={imagUrl} style={{float: 'left', height: 80, width: 80, margin: 10}} />
                    <div style={styles.itemContentView}>
                      <div style={styles.timeText}>{item.time}</div>
                      <div style={styles.titleText}>{item.title.substring(0, 15)}...</div>
                      <div style={{tabSize: 12}}>{item.summary.substring(0, 30)}...</div>
                    </div>
                  </div>
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

const styles = {
  tabBarUnderlineStyle: {
    backgroundColor: '#3CA0FF'
  },
  tabBarTextStyle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  tabBar: {
    width: '100%',
    height: 50
  },
  itemView: {
    height: 100,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemImage: {
    height: 80,
    width: 80,
    margin: 10,
    resizeMode: 'contain'
  },
  itemContentView: {
    paddingTop: 10,
    height: 80,
    flexDirection: 'column'
    // width:  - 120
  },
  timeText: {
    fontSize: 11,
    color: '#B4B4B4'
  },
  contentText: {
    fontSize: 14,
    color: '#B4B4B4',
    lineHeight: 16,
    marginTop: 5
  },
  titleText: {
    fontSize: 16,
    color: '#505050',
    marginTop: 5
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
