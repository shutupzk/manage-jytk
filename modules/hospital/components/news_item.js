import React, { Component } from 'react'

class NewsItem extends Component {
  // componentDidMount () {
  // }
  render () {
    var item = this.props.news
    let imagUrl = item.image ? item.image : '/static/icons/doctor_head.png'
    return (
      <div key={item.id} onClick={() => { this.props.gotoDetail(item) }}>
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

export default NewsItem
