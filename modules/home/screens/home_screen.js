import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Router from 'next/router'
import { CardWhite } from '../../../components'
import {
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
  gotoDetail (news) {
    selectNews({newsGroupId: news.groupId, newsId: news.id})
    Router.push('/hospital/news_detail?newsId=' + news.id + '&newsGroupId=' + news.groupId)
  }
  render () {
    let newses = this.props.newses
    let newNewses = this.getNewses(newses)
    return (
      <div style={{height: 600}}>
        <img src='/static/icons/banner3.png' />
        <CardWhite classChild='nav'>
          <Link href='/appointment/department_list'><a>
            <section className='navLeft'>
              <h3>预约挂号</h3>
              <p>预约挂号</p>
              <svg className='hosapmIcon' viewBox='62 541 146 131' version='1.1' xmlns='http://www.w3.org/2000/svg'>{hosApmHomeIcon}</svg>
            </section>
          </a></Link>
          <section className='navRight'>
            <Link href='/outpatient'><a>
              <article>
                <svg className='patientPayIcon' viewBox='48 -1 78 59' version='1.1' xmlns='http://www.w3.org/2000/svg'>{patientPayHomeIcon}</svg>
                <h3>门诊缴费</h3>
                <p>在线缴费不排队</p>
              </article>
            </a></Link>
            <Link href=''><a>
              <article>
                <svg className='selfExamineIcon' viewBox='39 -4 72 73' version='1.1' xmlns='http://www.w3.org/2000/svg'>{selfExamineHomeIcon}</svg>
                <h3>疾病自查</h3>
                <p>智能引导就诊</p>
              </article>
            </a></Link>
          </section>
          <section className='navRight'>
            <Link href='/report'><a>
              <article>
                <svg className='reportIcon' viewBox='600 381 62 57' version='1.1' xmlns='http://www.w3.org/2000/svg'>{reportHomeIcon}</svg>
                <h3>查询报告</h3>
                <p>在线查看检验报告</p>
              </article>
            </a></Link>
            <Link href='/inpatient'><a>
              <article>
                <svg className='inHosIcon' viewBox='600 594 62 55' version='1.1' xmlns='http://www.w3.org/2000/svg'>{inHosHomeIcon}</svg>
                <h3>住院跟踪</h3>
                <p>查询住院信息</p>
              </article>
            </a></Link>
          </section>
        </CardWhite>
        <div className='container'>
          <div style={{height: '100px', width: '100%'}}>
            <Link href='/hospital'>医院中心</Link>
          </div>
          <div>
            <div>
              <h3 style={{float: 'left'}}>健康咨询</h3>
              <Link href='hospital/news_list'><a style={{float: 'right', padding: '18px 0px'}}><span>更多>></span></a></Link>
              <div className='clearfix'></div>
            </div>
            <div>
              {
                this.props.loading || this.state.isInit ? 'loading...' : (this.props.error ? 'error'
                : <div>
                  {
                    newNewses.map((item) => {
                      return (
                        <div key={item.id}>
                          <NewsItem news={item} gotoDetail={(news) => { this.gotoDetail(news) }} />
                        </div>
                      )
                    })
                  }
                </div>
                )
              }
            </div>
          </div>
        </div>
        <style jsx global>{`
          .nav{
            display: -webkit-box;
            text-align: center;
          }
          .nav h3{
            color: #505050;
            font-size: .16rem;
            font-weight: normal;
            margin: .06rem 0 0;
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
            height: 1.05rem;
          }
          .navRight h3{
          }
          .navRight svg{
            display:block;
            margin: .15rem auto 0;
          }
          .navRight article:nth-of-type(1) {
            border-bottom: 1px solid #d8d8d8;
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

          .container {
            flex: 1;
            flexDirection: column;
          }
          img {
            height: 180;
            width: 100%;
            resizeMode: stretch;
          }
        `}</style>
      </div>
    )
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
  selectNews})(Home)
