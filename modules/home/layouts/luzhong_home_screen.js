import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Router from 'next/router'
import moment from 'moment'
import {HOME_PAGE} from 'config'
import { CardWhite, Loading, ErrCard, theme, NoDataCard } from 'components'
import {
  queryNewsGroups,
  queryNews,
  selectNews
} from '../../../ducks'
import NewsItem from '../../hospital/components/news_item'
import {home_styles} from './home_styles'

class LuZhongHome extends Component {
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
    this.setState({isInit: false})
  }
  getNewses (newses) {
    let newNewses = []
    for (var news in newses) {
      for (let newss of newses[news].newss) {
        let thenews = Object.assign({}, newss, { groupId: newses[news].id, type: newses[news].type })
        newNewses.push(thenews)
      }
    }
    return newNewses
  }
  gotoDetail (news) {
    selectNews({newsGroupId: news.groupId, newsId: news.id})
    Router.push('/hospital/news_detail?newsId=' + news.id + '&newsGroupId=' + news.groupId)
  }

  goHospitalPage () {
    console.log('====')
    Router.push('/hospital')
  }
  render () {
    if (this.props.newsLoading || this.state.isInit) {
      return (<div><Loading showLoading /></div>)
    }
    if (this.props.newsError) {
      return (<ErrCard content={this.props.error} />)
    }
    let newses = this.props.newses
    let newNewses = this.getNewses(newses)
    // let hospital = this.getHospital(this.props.hospitals)
    return (
      <div>
        <img src='/static/icons/banner3.png' style={{width: '100%'}} />
        <CardWhite classChild='nav'>
          <Link href={HOME_PAGE.grid_module[0].navigateName}><a>
            <section className='navLeft'>
              <h3 style={{margin: '.1rem 0'}}>{HOME_PAGE.grid_module[0].title}</h3>
							<img src={HOME_PAGE.grid_module[0].avatar} style={{width: 74, paddingTop: 26, paddingBottom: 44}} />
            </section>
          </a></Link>
          {
            [0, 2].map((itemcon) => {
              return (
                <section className='navRight' key={itemcon}>
                  {
                    HOME_PAGE.grid_module.slice(itemcon+1, itemcon+3) && HOME_PAGE.grid_module.slice(itemcon+1, itemcon+3).map((item, iKey) => {
                      return (
                        <Link href={item.navigateName} key={iKey}><a>
                          <article style={{borderBottom: '1px solid #fff',  borderColor: iKey === 0 || iKey === 2 ? theme.bordercolor : '#fff'}}>
                            <header className='flex lr-flex tb-flex'
                              style={{width: '100%', paddingTop: 20, height: 50}}>
                              <img src={item.avatar} style={item.imgStyle || {width: 38}} />
                            </header>
                            <h3>{item.title}</h3>
                          </article>
                        </a></Link>
                      )
                    })
                  }
                </section>
              )
            })
          }
        </CardWhite>
        <div onClick={() => { this.goHospitalPage() }}>
          <CardWhite classChild='hospitalCenter flex tb-flex'>
            <img src={HOME_PAGE.hospital.avatar} alt='' className='hosbgimg' />
            <section>
              <p style={{fontSize: 16, color: theme.mainfontcolor, fontWeight: 500}}>{HOME_PAGE.hospital.title}</p>
              {
                HOME_PAGE.hospital.subTitle.map((subtitle) => {
                  return <p key={subtitle} style={{fontSize: theme.nfontsize, marginTop: 3}}>{subtitle}</p>
                })
              }
            </section>
            <article className='back-left'>&nbsp;</article>
          </CardWhite>
        </div>
        <CardWhite classChild='consultList'>
            <dl>
            <dt className='left'>健康资讯</dt>
            <dd className='right' onClick={() => { Router.push('/hospital/news_list') }}>
                <span className='left'>更多</span>
                <article className='back-left right'>&nbsp;</article>
                <div className='clearfix'>&nbsp;</div>
            </dd>
            <div className='clearfix'>&nbsp;</div>
            </dl>
            <ul>
            {
                this.props.newsLoadding || this.state.isInit ?
                <Loading showLoading />
                :
                (this.props.newsError ?
                    <ErrCard />
                :
                    <ul>
                    {
											newNewses.length > 0 ?
                        newNewses.map((item, index) => {
                        return (
                            <div key={index}>
                            <NewsItem news={item} gotoDetail={(news) => { this.gotoDetail(news) }} />
                            </div>
                        )
                        })
												: <li style={{paddingLeft: theme.lrmargin, lineHeight: '40px', borderTop: '1px solid #fff', borderColor: theme.bordercolor}}>暂无数据</li>
                    }
                    </ul>
                )
            }
            </ul>
        </CardWhite>
        {home_styles()}
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    newses: state.news.data,
    // hospitals: state.hospitals.data,
    loading: state.news.loading || state.lastMessages.loading,
    error: state.news.error || state.lastMessages.error,
    newsLoadding: state.news.loading,
    newsError: state.news.error,
  }
}
export default connect(mapStateToProps, {
  queryNewsGroups,
  queryNews,
  selectNews})(LuZhongHome)
