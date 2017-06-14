import React, {Component } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
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
    return <div className='birtdayText'>{ `${user.sex === '0' ? '女' : '男'} | ${user.birthday}`}</div>
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
      <div className='topView'>
        <div style={{textAlign: 'center'}}><img className='avatar' src='/static/icons/male_header.png' /></div> 
        <div className='userInfo'>
          <div className='nameText'>{name}</div>
          { this.birthdayView(user) }
        </div>
        <Link href={href}>
          <a>
            <div style={{fontSize: 13, color: '#3CA0FF', textAlign: 'center'}} >{title} ></div>
          </a>
        </Link>
      </div>
    )
  }

  buttomList (token) {
    const array = [
      { title: '就诊人管理', icon: 'people', type: 'simple-line-icon', navigateUrl: 'profile/patient_list' },
      { title: '我的医生', icon: 'doctor_head', type: 'simple-line-icon', navigateUrl: 'profile/my_doctors' },
      { title: '缴费记录', icon: '', type: 'simple-line-icon', navigateUrl: 'profile/deposit_record' },
      // { title: '我的随访', icon: 'pencil-square-o', type: 'font-awesome', navigateUrl: 'ehr' },
      { title: '满意度评价', icon: 'like', type: 'simple-line-icon', navigateUrl: 'profile/evaluation' }
    ]
    const array2 = [
      { title: '医保卡信息', icon: 'idCard_icon', type: 'simple-line-icon', navigateUrl: 'profile/carte_vital' },
      { title: '修改密码', icon: 'password', type: 'simple-line-icon', navigateUrl: 'profile/setPassword' },
      { title: '隐私条款', icon: 'prvite', type: 'simple-line-icon', navigateUrl: 'profile/privacy_terms' },
      { title: '常见问题', icon: 'question', type: 'simple-line-icon', navigateUrl: 'profile/questions' },
      // { title: '我的报告单', icon: 'doc', type: 'simple-line-icon', navigateUrl: 'favorite_list' },
      { title: '退出登录', icon: 'logout', type: 'simple-line-icon', navigateUrl: 'logout' }
      // { title: '设置', icon: 'settings', type: 'simple-line-icon', navigateUrl: 'setting' }
    ]
    return (
      <div className='list'>
        <div style={{marginBottom: 10, display: 'flex', padding: 10, backgroundColor: '#fff'}}>
          {
            array.map((item, i) => {
              var href = 'signin'
              if (token) {
                href = '/' + item.navigateUrl
              }
              return (
                <div
                  style={{flex: 1, alignItems: 'center'}}
                >
                  <Link
                    key={i}
                    href={href}
                  >
                    <a style={{alignItems: 'center'}}>
                      <img src={`/static/icons/${item.icon}.png`} type={item.type} height='16' width='16' style={{color: '#505050'}} />
                      <div style={{fontSize: 15}}>{item.title}</div>
                    </a>
                  </Link>
                </div>
              )
            })
          }
          <div className='clearfix'>&nbsp;</div>
        </div>
        <div>
          {
            array2.map((item, i) => {
              var href = '/signin'
              if (token) {
                href = '/' + item.navigateUrl
              }
              if (item.navigateUrl === 'logout') {
                return (
                  <div
                    style={{flex: 1, backgroundColor: '#fff', padding: 10, marginBottom: 1}}
                    onClick={() => { this.doSignout() }}
                  >
                    <a style={{display: 'flex'}}>
                      <img src={`/static/icons/${item.icon}.png`} type={item.type} height='16' width='16' style={{color: '#505050'}} />
                      <div style={{fontSize: 15}}>{token ? item.title : '未登录'}</div>
                    </a>
                  </div>
                )
              }
              return (
                <div style={{flex: 1, backgroundColor: '#fff', padding: 10, marginBottom: 1}}>
                  <Link
                    key={i}
                    href={href}
                  >
                    <a style={{display: 'flex'}}>
                      <img src={`/static/icons/${item.icon}.png`} type={item.type} height='16' width='16' style={{color: '#505050'}} />
                      <div style={{fontSize: 15}}>{item.title}</div>
                    </a>
                  </Link>
                </div>
              )
            })
          }
        </div>
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
      return <div className='container'>loading...</div>
    }
    return (
      <div className='container'>
        { this.topView(user) }
        { this.buttomList(token) }
        <style jsx global>{`
          .list {
            border-top: none;
            margin-top: 0px;
            margin-bottom: 15px;
            border-bottom: none;
          }
          .topView {
            align-items: center;
            background-color: #ffffff;
            height: 200px;
            margin-bottom: 12px;
          },
          .avatar {
            width: 70px;
            height: 70px;
            margin-top: 20px;
          }
          .userInfo {
            align-items: center;
            height: 70px;
          }
          .nameText {
            text-align: center;
            height: auto;
            font-size: 18px;
            margin-top: 16px;
            color: #505050;
          }
          .birtdayText {
            text-align: center;
            font-size: 14px;
            margin-top: 8px;
            color: #797979;
          },
          .middleView {
            flex-wrap: nowrap;
            align-self: center;
            flex-direction: row;
            background-color: #ffffff;
          },
          .icon {
            align-self: center;
            width: 15px;
            height: 15px;
            margin-left: 5px;
            margin-right: 5px;
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
