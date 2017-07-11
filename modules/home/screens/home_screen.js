import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Router from 'next/router'
import { CardWhite, Loading, ErrCard, theme } from 'components'
import {
  queryHospitals,
  queryNewsGroups,
  queryNews,
  selectNews
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
  }

  async queryNews () {
    this.setState({isInit: true})
    await this.props.queryNewsGroups(this.props.client)
    await this.props.queryHospitals(this.props.client)
    // let newses = this.props.newses
    // let newNewses = this.getNewses(newses) || []
    // if (newNewses.length > 0) {
    //   this.setState({groupId: newNewses[0].id})
    //   this.props.queryNews(this.props.client, {groupId: newNewses[0].id})
    // }
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
    if (this.props.loading || this.state.isInit) {
      return (<div><Loading showLoading={true} /></div>)
    }
    let newses = this.props.newses
    let newNewses = this.getNewses(newses)
    let hospital = this.getHospital(this.props.hospitals)
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
            <img src='/static/icons/homepage_hospitalname.png' alt='' className='hosbgimg' />
            <section>
              <p style={{fontSize: 16, color: theme.mainfontcolor, fontWeight: 500}}>{'走进省医'}</p>
              <p style={{fontSize: theme.nfontsize, marginTop: 3}}>医生介绍/就诊指南/停诊信息</p>
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
                'loading...'
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
        </CardWhite>
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

          .consultList{

          }
          .consultList dl{
            padding: .1rem .15rem;
            height: .2rem;
            line-height: .2rem;
            color: #505050;
            text-indent: 6px;
          }
          .consultList dl dt{
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
          .consultList dl dd{
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
        `}</style>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    newses: state.news.data,
    hospitals: state.hospitals.data,
    loading: state.hospitals.loading,
    error: state.hospitals.error,
    newsLoadding: state.news.loading,
    newsError: state.news.error
  }
}
export default connect(mapStateToProps, {
  queryHospitals,
  queryNewsGroups,
  queryNews,
  selectNews})(Home)
