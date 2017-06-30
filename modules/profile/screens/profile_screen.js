import React, {Component } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import {Loading, CardWhite} from 'components'
import theme from 'components/theme'
import { signin, queryUser, queryPatients, signout, clearPateints } from '../../../ducks'

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
    const token = user.token
    const navigateUrl = 'profile/user_info'
    let href = '/signin'
    if (token) {
      href = '/' + navigateUrl
    }
    return (
      <CardWhite classChild='topView'>
        <img src='/static/icons/user_male.png' />
        <section>
          <p className='nameText'>{name}</p>
          { this.birthdayView(user) }
        </section>
        <Link href={href}>
          <a>
            <div style={{fontSize: 13, color: '#3CA0FF', textAlign: 'center'}} >{title} ></div>
          </a>
        </Link>
      </CardWhite>
    )
  }

  buttomList (token) {
    const array = [
      { title: '就诊人管理', icon: 'familyIcon', type: 'simple-line-icon', navigateUrl: 'profile/patient_list' },
      { title: '我的医生', icon: 'doctors', type: 'simple-line-icon', navigateUrl: 'profile/my_doctors' },
      { title: '缴费记录', icon: 'depositRecords', type: 'simple-line-icon', navigateUrl: 'profile/deposit_record' },
      // { title: '我的随访', icon: 'pencil-square-o', type: 'font-awesome', navigateUrl: 'ehr' },
      { title: '满意度评价', icon: 'evaluationIcon', type: 'simple-line-icon', navigateUrl: 'profile/evaluation' }
    ]
    const array2 = [
      // { title: '医保卡信息', icon: 'cartecardicon', type: 'simple-line-icon', navigateUrl: 'profile/carte_vital' },
      { title: '修改密码', icon: 'setpassword', type: 'simple-line-icon', navigateUrl: 'profile/setPassword' },
      { title: '隐私条款', icon: 'prvite', type: 'simple-line-icon', navigateUrl: 'profile/privacy_terms' },
      { title: '常见问题', icon: 'question', type: 'simple-line-icon', navigateUrl: 'profile/questions' },
      // { title: '我的报告单', icon: 'doc', type: 'simple-line-icon', navigateUrl: 'favorite_list' },
      { title: '退出登录', icon: 'logout', type: 'simple-line-icon', navigateUrl: 'logout' }
      // { title: '设置', icon: 'settings', type: 'simple-line-icon', navigateUrl: 'setting' }
    ]
    return (
      <div className=''>
        <CardWhite classChild='middleView'>
          {
            array.map((item, i) => {
              var href = 'signin'
              if (token) {
                href = '/' + item.navigateUrl
              }
              return (
                <article
                  className='left'
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
              if (token) {
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
                        <dd>{token ? item.title : '未登录'}</dd>
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
    const token = this.props.token
    const user = this.props.user
    if (this.props.error) {
      return <div className='container'>error...</div>
    }
    if (this.props.loading) {
      return <Loading showLoading={this.props.loading || this.state.isInit} />
    }
    return (
      <div className='container'>
        { this.topView(user) }
        { this.buttomList(token) }
        <style jsx global>{`
          .topView {
            text-align: center;
            margin-top: 0;
            padding: .2rem 0 ${theme.tbmargin};
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
            color: ${theme.mainfontcolor};
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
