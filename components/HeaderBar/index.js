import React, { Component } from 'react'
import Router from 'next/router'
import {HOSPITALINFO, HOSPITAL_NAME, MAINFUNCTION} from 'config'
import canlendarStyles from './Wrapper'
import Link from 'next/link'
import {theme} from 'components'
import { signout } from 'ducks'
import { connect } from 'react-redux'

class HeaderBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showLogutBtn: false,
    }
  }

  // 登出
  async doSignout () {
    await this.props.signout()
    // this.props.navigation.goBack(null)
  }

  headerUser() {
    return (
      <div className={'headerUser left'}>
        <div className='flex tb-flex' onClick={() => {
            const prevshowLogutBtn = this.state.showLogutBtn;
            this.setState({
              showLogutBtn: !prevshowLogutBtn
            });
          }}>
          <img src='/static/icons/doctorheader.png' style={{height: '.14rem'}} />
          <span className='left'>{'医生'}</span>
          <article className='sanjiao headerUserBack'
            style={{borderTopColor: theme.nfontcolor}}></article>
        </div>
        <section>
          <Link href='/modify-pass'><article>修改密码</article></Link>
          <article onClick={() => {this.doSignout()}}>退出</article>
        </section>
      </div>
    )
  }

  render () {
    const hideRightCon = this.props.hideRightCon || false;
    const {showLogutBtn} = this.state;
    console.log('------props', this.props)
    const curUrl = this.props.url && this.props.url.pathname
    return (
      <div className={'headerBar'}>
        <img style={{
            height: '.26rem',
            padding: '0 .1rem 0 .3rem',
            marginTop: '.16rem'}} src={HOSPITALINFO.hospital_loginlogo} className='left' />
        <article className='left'>{HOSPITAL_NAME}</article>
        {
          hideRightCon ?
            ''
          :
            <section className='headerBarRight right'>
              <ul className='left'>
                {
                  MAINFUNCTION.map((item, iKey) => {
                    return (
                      <li
                        className={(curUrl.indexOf(item.short_name) > -1) ? 'left curLi' : 'left'}
                        onClick={() => {Router.push(item.navigateName)}}
                        key={iKey}>{item.title}</li>
                    )
                  })
                }
                <div className='clearfix'></div>
              </ul>
              {this.headerUser()}
              <div className='clearfix'></div>
            </section>
        }
        {canlendarStyles()}
        <div className='clearfix'></div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps, { signout })(HeaderBar)