import React, { Component } from 'react'

class NewsItem extends Component {
  // componentDidMount () {
  // }
  render () {
    var item = this.props.news
    let imagUrl = item.image ? item.image : '/static/icons/doctor_head.png'
    return (
      <div key={item.id} onClick={() => { this.props.gotoDetail(item) }}>
        <li className={'flex tb-flex newsItem'} key={item.id} onClick={() => { this.props.gotoDetail(item) }}>
          <img src={imagUrl} alt='' />
          <section>
            <article>{item.time}</article>
            <h3 className='textoverflow1'>{item.title}</h3>
            <p className='textoverflow2'>{item.summary}</p>
          </section>
        </li>
        <style jsx global>{`
          .newsItem{
            border-top: 1px solid #d8d8d8;
            padding: .12rem .15rem;
            height: .9rem;
            color: #777777;
            font-size: .11rem;
          }
          .newsItem img{
            width: .9rem;
            height: .9rem;
            margin-right: .15rem;
          }
          .newsItem p{
            color: #797979;
            font-size: .14rem;
            line-height: .2rem;
          }
          .newsItem h3{
            color: #505050;
            font-weight: 500;
            font-size: .15rem;
            margin: .06rem 0;
          }
        `}</style>
      </div>
    )
  }
}

export default NewsItem
