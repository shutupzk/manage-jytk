import React, { Component } from 'react'
import {theme} from 'components'

class NewsItem extends Component {
  // componentDidMount () {
  // }
  render () {
    var item = this.props.news
    let imagUrl = item.image ? item.image : '/static/icons/doctor_head.png'
    return (
      <div key={item.id} onClick={() => { this.props.gotoDetail(item) }}>
        <li className={'newsItem'} style={{background: '#fff'}} key={item.id} onClick={() => { this.props.gotoDetail(item) }}>
          <img src={imagUrl} alt='' />
          <section>
            <article>{item.time}</article>
            <h3 className='textoverflow1'>{item.title}</h3>
            <p className='textoverflow2'>{item.summary}</p>
          </section>
        </li>
        <style jsx global>{`
          .newsItem{
            border-top: 1px solid ${theme.bordercolor};
            padding: .12rem .15rem;
            height: .9rem;
            color: #777777;
            font-size: .11rem;
            position: relative;
          }
          .newsItem img{
            width: .9rem;
            height: .9rem;
            position: absolute;
            top: .12rem;
            left: ${theme.lrmargin};
          }
          .newsItem p{
            color: ${theme.fontcolor};
            font-size: .14rem;
            line-height: .2rem;
          }
          .newsItem h3{
            color: ${theme.mainfontcolor};
            font-weight: 500;
            font-size: ${theme.fontsize};;
            margin: .06rem 0;
          }
          .newsItem section{
            margin-left: 1.05rem;
          }
        `}</style>
      </div>
    )
  }
}

export default NewsItem
