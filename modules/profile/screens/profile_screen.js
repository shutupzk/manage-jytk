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
    console.log('自动登录')
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
    this.props.navigation.goBack(null)
  }
  birthdayView (user) {
    if (!user.birthday) return null
    return <div style={styles.birtdayText}>{ `${user.sex === '0' ? '女' : '男'} | ${user.birthday}`}</div>
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
      <div style={styles.topView}>
        <div style={{textAlign: 'center'}}><img style={styles.avatar} src='/static/icons/male_header.png' /></div> 
        <div style={styles.userInfo}>
          <div style={styles.nameText}>{name}</div>
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
      { title: '就诊人管理', icon: 'people', type: 'simple-line-icon', navigateUrl: 'patient_list' },
      { title: '我的医生', icon: 'star', type: 'simple-line-icon', navigateUrl: 'doctor_list' },
      { title: '缴费记录', icon: 'star', type: 'simple-line-icon', navigateUrl: 'payment_list' },
      // { title: '我的随访', icon: 'pencil-square-o', type: 'font-awesome', navigateUrl: 'ehr' },
      { title: '满意度评价', icon: 'like', type: 'simple-line-icon', navigateUrl: 'evaluation' }
    ]
    const array2 = [
      { title: '医保卡信息', icon: 'doc', type: 'simple-line-icon', navigateUrl: 'healthcare_card' },
      { title: '修改密码', icon: 'password', type: 'simple-line-icon', navigateUrl: 'profile/setPassword' },
      { title: '隐私条款', icon: 'prvite', type: 'simple-line-icon', navigateUrl: 'prviteInfo' },
      { title: '常见问题', icon: 'question', type: 'simple-line-icon', navigateUrl: 'questions' },
      // { title: '我的报告单', icon: 'doc', type: 'simple-line-icon', navigateUrl: 'favorite_list' },
      { title: '退出登录', icon: 'logout', type: 'simple-line-icon', navigateUrl: 'logout' }
      // { title: '设置', icon: 'settings', type: 'simple-line-icon', navigateUrl: 'setting' }
    ]
    return (
      <div style={styles.list}>
        <div style={{marginBottom: 20, display: 'flex'}}>
          {
            array.map((item, i) => {
              var href = 'sigin'
              if (token) {
                href = '/' + item.navigateUrl
              }
              return (
                <div
                  style={{flex: 1}}
                >
                  <Link
                    key={i}
                    href={href}
                  >
                    <a>
                      <div style={{fontSize: 15}}>{item.title}</div>
                      <img src={item.icon} type={item.type} height='16' width='16' style={{color: '#505050'}} />
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
              var href = '/sigin'
              if (token) {
                href = '/' + item.navigateUrl
              }
              if (item.navigateUrl === 'logout') {
                return (
                  <div
                    style={{flex: 1}}
                    onClick={() => { this.doSignout() }}
                  >
                    <a>
                      <div style={{fontSize: 15}}>{item.title}</div>
                      <img src={item.icon} type={item.type} height='16' width='16' style={{color: '#505050'}} />
                    </a>
                  </div>
                )
              }
              return (
                <div style={{flex: 1}}>
                  <Link
                    key={i}
                    href={href}
                  >
                    <a>
                      <div style={{fontSize: 15}}>{item.title}</div>
                      <img src={item.icon} type={item.type} height='16' width='16' style={{color: '#505050'}} />
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
    return (
      <div className='container'>
        { this.topView(user) }
        { this.buttomList(token) }
      </div>
    )
  }
}

const styles = {
  container: {
    flex: 1
  },
  list: {
    borderTopWidth: 0,
    marginTop: 0,
    marginBottom: 15,
    borderBottomWidth: 0
  },
  topView: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 200,
    marginBottom: 12
  },
  avatar: {
    width: 70,
    height: 70,
    marginTop: 20
  },
  userInfo: {
    alignItems: 'center',
    height: 70
  },
  nameText: {
    textAlign: 'center',
    height: 'auto',
    fontSize: 18,
    marginTop: 16,
    color: '#505050'
  },
  birtdayText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
    color: '#797979'
  },
  middleView: {
    flexWrap: 'nowrap',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff'
  },
  icon: {
    alignSelf: 'center',
    width: 15,
    height: 15,
    marginLeft: 5,
    marginRight: 5
  }
}

function mapStateToProps (state) {
  console.log('state:', state)
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    user: state.user.data,
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, {signin, queryUser, queryPatients, signout, clearPateints})(ProfileScreen)
