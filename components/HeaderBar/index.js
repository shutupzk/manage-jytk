import React, { Component } from 'react'
import Router from 'next/router'
import { HOSPITAL_NAME, MAINFUNCTION } from '../../config'
import canlendarStyles from './Wrapper'
// import Link from 'next/link'
import { theme } from '../../components'
import { signout } from '../../ducks'
import { connect } from 'react-redux'
import localforage from 'localforage'

class HeaderBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showLogutBtn: false
    }
  }

  // 登出
  async doSignout () {
    // let error = await this.props.signout()
    // console.log(error)
    localforage.clear()
    Router.push('/signin')
  }

  headerUser () {
    return (
      <div className={'headerUser left'}>
        <div
          className='flex tb-flex'
          onClick={() => {
            const prevshowLogutBtn = this.state.showLogutBtn
            this.setState({
              showLogutBtn: !prevshowLogutBtn
            })
          }}
        >
          <img src='/static/icons/doctorheader.png' style={{ height: '.14rem' }} />
          <span className='left'>{'管理员'}</span>
          <article className='sanjiao headerUserBack' style={{ borderTopColor: theme.nfontcolor }} />
        </div>
        <section>
          {/* <Link href='/profile/update_password'>
            <article>修改密码</article>
          </Link> */}
          <article
            onClick={() => {
              this.doSignout()
            }}
          >
            退出
          </article>
        </section>
      </div>
    )
  }

  render () {
    const hideRightCon = this.props.hideRightCon || false
    // const { showLogutBtn } = this.state
    const curUrl = this.props.url && this.props.url.pathname
    // const imgstylenormal = { height: '.26rem', padding: '0 .1rem 0 .3rem', marginTop: '.16rem' }
    return (
      <div className={'headerBar'}>
        {/* <img style={HOSPITALINFO.headerImg && HOSPITALINFO.headerImg.imgstyle ? HOSPITALINFO.headerImg.imgstyle : imgstylenormal} src={HOSPITALINFO.hospital_loginlogo} className='left' /> */}
        <article className='left' style={{marginLeft: '20px', fontSize: 18}}>{HOSPITAL_NAME}管理后台</article>
        {hideRightCon ? (
          ''
        ) : (
          <section className='headerBarRight right'>
            <ul className='left'>
              {MAINFUNCTION.map((item, iKey) => {
                return (
                  <li
                    className={curUrl.indexOf(item.short_name) > -1 ? 'left curLi' : 'left'}
                    onClick={() => {
                      Router.push(item.navigateName)
                    }}
                    key={iKey}
                  >
                    {item.title}
                  </li>
                )
              })}
              <div className='clearfix' />
            </ul>
            {this.headerUser()}
            <div className='clearfix' />
          </section>
        )}
        {canlendarStyles()}
        <div className='clearfix' />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    // token: state.user.data.token,
    // adminId: state.user.data.id,
    // loading: state.user.loading,
    // error: state.user.error
  }
}

export default connect(mapStateToProps, { signout })(HeaderBar)
