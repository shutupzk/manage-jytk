import React, {Component } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import {Loading, CardWhite, ErrCard, theme} from 'components'
import { signin, queryUser, queryPatients, signout, clearPateints } from '../../../ducks'
import {PROFILE_FUNCTION_LIST} from 'config'

class ProfileScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    this.autoSignin()
  }

  // 自动登陆 刷新token,用户信息,就诊人信息，
  async autoSignin () {
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId
    if (userId) {
      this.props.queryUser(this.props.client, { userId })
      this.props.queryPatients(this.props.client, {userId})
    }
  }
  // 登出
  async doSignout () {
    await this.props.signout()
    this.props.clearPateints()
    // this.props.navigation.goBack(null)
  }
  birthdayView (user) {
    if (!user.birthday) return null
    return <p className='birtdayText'>{ `${user.sex === '0' ? '女' : '男'} | ${user.birthday}`}</p>
  }
  topView (user) {
    const title = user.name ? '个人信息' : '去登录'
    const name = user.name || '请登录'
    // const token = user.token
    const navigateUrl = 'profile/user_info'
    let href = '/signin'
    if (user.name) {
      href = '/' + navigateUrl
    }
    const headerImg = (!user.sex || user.sex !== '0') ? 'user_male' : 'user_female'
    return (
      <div className='topView'>
        <img src={`/static/icons/${headerImg}.png`} />
        <section>
          <p className='nameText'>{name}</p>
          { this.birthdayView(user) }
        </section>
        <Link href={href}>
          <a>
            <div style={{fontSize: 13, color: '#fff', textAlign: 'center'}} >{title} ></div>
          </a>
        </Link>
      </div>
    )
  }

  buttomList (user) {
    const array = PROFILE_FUNCTION_LIST.middleView
    const array2 = PROFILE_FUNCTION_LIST.bottomView
    const middleViewItemWidth = (100/array.length) + '%'
    return (
      <div className=''>
        <CardWhite classChild='middleView'>
          {
            array.map((item, i) => {
              var href = 'signin'
              if (user.name) {
                href = '/' + item.navigateUrl
              }
              return (
                <article
                  className='left'
                  style={{width: middleViewItemWidth}}
                >
                  <Link
                    key={i}
                    href={href}
                  >
                    <a>
                      <img src={`/static/icons/${item.icon}.png`} type={item.type} />
                      <p>{item.title}</p>
                    </a>
                  </Link>
                </article>
              )
            })
          }
          <div className='clearfix'>&nbsp;</div>
        </CardWhite>
        <CardWhite classChild='bottomView'>
          {
            array2.map((item, i) => {
              var href = '/signin'
              if (user.name) {
                href = '/' + item.navigateUrl
              }
              if (item.navigateUrl === 'logout') {
                return (
                  <div
                    onClick={() => { this.doSignout() }}
                  >
                    <a className='flex tb-flex'>
                      <dl className='flex tb-flex'>
                        <dt><img src={`/static/icons/${item.icon}.png`} type={item.type} className='left' /></dt>
                        <dd>{user.name ? item.title : '未登录'}</dd>
                      </dl>
                    </a>
                  </div>
                )
              }
              return (
                <Link
                  key={i}
                  href={href}
                >
                  <a className='flex tb-flex'>
                    <dl className='flex tb-flex'>
                      <dt><img src={`/static/icons/${item.icon}.png`} type={item.type} className='left' /></dt>
                      <dd>{item.title}</dd>
                    </dl>
                    <i className='back-left'></i>
                  </a>
                </Link>
              )
            })
          }
        </CardWhite>
      </div>
    )
  }
  render () {
    // const token = this.props.token
    const user = this.props.user
    if (this.props.error) {
      return <div className='container'><ErrCard /></div>
    }
    if (this.props.loading) {
      return <Loading showLoading={this.props.loading || this.state.isInit} />
    }
    return (
      <div className='container'>
        { this.topView(user) }
        { this.buttomList(user) }
        <style jsx global>{`
          .topView {
            text-align: center;
            margin-top: 0;
            padding: .2rem 0 ${theme.tbmargin};
            background: ${theme.maincolor};
            color: #fff;
          }
          .topView img{
            width: .7rem;
            height: .7rem;
            border-radius: 50%;
          }
          .topView section{
            padding: ${theme.tbmargin} 0;
          }
          .nameText {
            line-height: .3rem;
            font-size: .18rem;
          }
          .birtdayText {
            margin-top: ${theme.lrmargin};
          }
          .middleView {
            margin-bottom: ${theme.tbmargin};
            padding: .13rem 0 ${theme.tbmargin};
            box-shadow: inset 0px -1px 0px 0px #E6E6E6, inset 0px 1px 0px 0px #E6E6E6;
          }
          .middleView article{
            width: 25%;
            text-align: center;
          }
          .middleView article img{
            height: .28rem;
          }
          .middleView article p{
            padding-top: .03rem;
            color: ${theme.mainfontcolor};
          }
          .bottomView {
            border-top: 1px solid ${theme.bordercolor};
          }
          .bottomView a{
            border-bottom: 1px solid ${theme.bordercolor};
            line-height: 44px;
            padding: 0 .15rem;
            justify-content: space-between;
          }
          .bottomView dt{
            width: .26rem;
            text-align: center;
          }
          .bottomView dd{
            color: ${theme.mainfontcolor};
          }
          .bottomView a:nth-of-type(1) img{
            height: .14rem;
            padding-top: .02rem;
          }
          .bottomView img{
            height: .16rem;
          }
          .bottomView i{
            transform: rotate(135deg);
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    user: state.user.data,
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, {signin, queryUser, queryPatients, signout, clearPateints})(ProfileScreen)
