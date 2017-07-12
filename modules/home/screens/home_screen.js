import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Router from 'next/router'
import moment from 'moment'
import {HOME_PAGE} from 'config'
import { CardWhite, Loading, ErrCard, theme, NoDataCard } from 'components'
import {
  queryHospitals,
  queryNewsGroups,
  queryNews,
  selectNews,
  queryMessageTypes,
  queryMessages,
  selectMessageType,
  queryLastMessage
} from '../../../ducks'
import NewsItem from '../../hospital/components/news_item'
import {hosApmHomeIcon, patientPayHomeIcon, selfExamineHomeIcon, reportHomeIcon, inHosHomeIcon} from '../../../static/icons/svgIcon'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      groupId: null
    }
  }
  componentWillMount () {
    this.queryNews()
    this.props.queryLastMessage(this.props.client, {limit: 3})
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
  getHospital (hospitals) {
    return hospitals[Object.keys(hospitals)[0]]
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
    const messages = this.props.messages
    let newses = this.props.newses
    let newNewses = this.getNewses(newses)
    // let hospital = this.getHospital(this.props.hospitals)
    return (
      <div>
        <img src='/static/icons/banner3.png' style={{width: '100%'}} />
        <CardWhite classChild='nav'>
          <Link href='/appointment/department_list'><a>
            <section className='navLeft'>
              <h3>预约挂号</h3>
              <svg className='hosapmIcon' viewBox="62 541 146 131" version="1.1" xmlns="http://www.w3.org/2000/svg">{hosApmHomeIcon}</svg>
            </section>
          </a></Link>
          <section className='navRight'>
            <Link href='/outpatient/order_type'><a>
              <article style={{borderBottom: '1px solid #fff', borderColor: theme.bordercolor}}>
                <svg className='patientPayIcon' viewBox="355 394 78 59" version="1.1" xmlns="http://www.w3.org/2000/svg">{patientPayHomeIcon}</svg>
                <h3>门诊缴费</h3>
              </article>
            </a></Link>
            <Link href='/diagnosis'><a>
              <article>
                <svg className='selfExamineIcon' viewBox="359 604 71 71" version="1.1" xmlns="http://www.w3.org/2000/svg">{selfExamineHomeIcon}</svg>
                <h3>疾病自查</h3>
              </article>
            </a></Link>
          </section>
          <section className='navRight'>
            <Link href='/report'><a>
              <article style={{borderBottom: '1px solid #fff', borderColor: theme.bordercolor}}>
                <svg className='reportIcon' viewBox="600 399 62 57" version="1.1" xmlns="http://www.w3.org/2000/svg">{reportHomeIcon}</svg>
                <h3>查询报告</h3>
              </article>
            </a></Link>
            <Link href='/inpatient'><a>
              <article>
                <svg className='inHosIcon' viewBox="600 614 62 55" version="1.1" xmlns="http://www.w3.org/2000/svg">{inHosHomeIcon}</svg>
                <h3>住院跟踪</h3>
              </article>
            </a></Link>
          </section>
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
        {
          HOME_PAGE.other_modules.indexOf('健康资讯') > -1
          ? <CardWhite classChild='consultList'>
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
                          newNewses.map((item, index) => {
                            return (
                              <div key={index}>
                                <NewsItem news={item} gotoDetail={(news) => { this.gotoDetail(news) }} />
                              </div>
                            )
                          })
                        }
                      </ul>
                    )
                }
              </ul>
            </CardWhite> : ''
        }
        {
          HOME_PAGE.other_modules.indexOf('最新消息') > -1
          ? <CardWhite>
          <dl className='consultListheader'>
            <dt className='left'>最新消息</dt>
            <dd className='right' onClick={() => { Router.push('/message_types') }}>
              <span className='left'>全部</span>
              <article className='back-left right'>&nbsp;</article>
              <div className='clearfix'>&nbsp;</div>
            </dd>
            <div className='clearfix'>&nbsp;</div>
          </dl>
          <div style={{background: '#fff', borderTop: '1px solid #fff', borderColor: theme.bordercolor}}>
            {
              this.props.messageLoading || this.state.isInit
              ? <Loading showLoading />
              : (this.props.messageError
                ? <ErrCard content={this.props.messageError} />
                : messages.map((message) => {
                  const imgUrl = '/static/icons/megtype' + message.messageType.code + '.png'
                  return (
                    <div key={message.id}
                      style={{borderBottom: '1px solid #fff',
                        borderColor: theme.bordercolor,
                        padding: '10px 15px',
                        color: theme.nfontcolor,
                        display: '-webkit-box'}}
                      onClick={() => {
                        this.props.selectMessageType({typeId: message.messageType.id})
                        Router.push('/message_types/messages?typeId=' + message.messageType.id)
                      }}
                    >
                      <article style={{height: 40, width: 40, paddingRight: theme.tbmargin, position: 'relative'}}>
                        <img src={imgUrl} style={{height: 40, width: 40}} />
                        {message.read ? <span style={{position: 'absolute', top: '-2px', left: '36px', width: 8, height: 8, background: '#f00', borderRadius: '100%'}} /> : ''}
                      </article>
                      <dl className='consultListitem'>
                        <dt>
                          <span style={{color: theme.mainfontcolor}}>{message.messageType.name}</span>
                          <span style={{float: 'right', fontSize: theme.nfontsize}}>{moment(message.createdAt) < moment(moment().format('YYYY-MM-DD')) ? moment(message.createdAt).format('YYYY-MM-DD') : moment(type.messageTime).format('HH:mm')}</span>
                        </dt>
                        <dd className='textoverflow1' style={{fontSize: 14}}>{messages.content}</dd>
                      </dl>
                    </div>
                  )
                })
              )
            }
          </div>
        </CardWhite> : ''
        }
        <style jsx global>{`
          .nav{
            display: -webkit-box;
            text-align: center;
          }
          .nav h3{
            color: #505050;
            font-size: .16rem;
            font-weight: normal;
            margin: .1rem 0 0;
          }
          .nav p{
            color: #b4b4b4;
            font-size: .12rem;
            margin: 0;
          }

          .navLeft{
            width: 1.3rem;
            padding-top: .44rem;
          }
          .hosapmIcon{
            width: .72rem;
            height: .64rem;
            display:block;
            margin: .18rem auto 0;
          }

          .navRight{
            -webkit-box-flex: 0.5;
            border-left: 1px solid #d8d8d8;
          }
          .navRight article{
            height: .85rem;
          }
          .navRight h3{
          }
          .navRight svg{
            display:block;
            margin: .25rem auto 0;
          }
          .patientPayIcon{
            width: .38rem;
            height: .3rem;
          }
          .selfExamineIcon{
            width: .32rem;
            height: .32rem;
          }
          .reportIcon{
            width: .3rem;
            height: .3rem;
          }
          .inHosIcon{
            width: .32rem;
            height: .32rem;
          }
          .hospitalCenter{
            padding: 0;
            display: -webkit-box;
            height: 1rem;
            position: relative;
            background: #fff;
            padding-right: .15rem;
          }
          .hospitalCenter .hosbgimg{
            height: 1rem;
            {/*position: absolute;
            top: 0;
            left: 0;*/}
          }
          .hospitalCenter section{
            -webkit-box-flex: 1;
            {/*padding-left: .15rem;*/}
            color: #797979;
          }
          .hospitalCenter section p{
            line-height: 20px;
            font-size: .13rem;
          }
          .hospitalCenter article{
            display: block;
            transform: rotate(135deg);
          }
          .consultList dl{
            padding: .1rem .15rem;
            height: .2rem;
            line-height: .2rem;
            color: #505050;
            text-indent: 6px;
          }
          .consultListheader{
            padding: .1rem .15rem;
            height: .2rem;
            line-height: .2rem;
            color: #505050;
            text-indent: 6px;
          }
          .consultListheader dt{
            font-weight: 500;
          }
          .consultList dl dt:after{
            content: '';
            display: block;
            float: left;
            width: .04rem;
            height: .2rem;
            background: #257BDE;
            border-radius: .03rem;
          }
          .consultListheader dt:after{
            content: '';
            display: block;
            float: left;
            width: .04rem;
            height: .2rem;
            background: #257BDE;
            border-radius: .03rem;
          }
          .consultList dl dd {
            color: #b4b4b4;
            font-size: .13rem;
          }
          .consultListheader dd{
            color: #b4b4b4;
            font-size: .13rem;
          }
          .consultList dl dd article{
            width: .06rem;
            height: .06rem;
            border-top: .02rem solid #C7C7CC;
            border-left: .02rem solid #C7C7CC;
            transform: rotate(135deg);
            margin-top: .06rem;
          }
          .consultListheader dd article{
            width: .06rem;
            height: .06rem;
            border-top: .02rem solid #C7C7CC;
            border-left: .02rem solid #C7C7CC;
            transform: rotate(135deg);
            margin-top: .06rem;
          }
          .consultListitem{
            -webkit-box-flex: 1;
          }
        `}</style>
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
    messageLoading: state.lastMessages.loading,
    messageError: state.lastMessages.error,
    messages: state.lastMessages.data
  }
}
export default connect(mapStateToProps, {queryMessageTypes,
  queryMessages,
  selectMessageType,
  queryLastMessage,
  queryHospitals,
  queryNewsGroups,
  queryNews,
  selectNews})(Home)
