import React, { Component } from 'react'
import {HOSPITALINFO, HOSPITAL_NAME, MAINFUNCTION} from 'config'
import canlendarStyles from './Wrapper'
import Link from 'next/link'
import {theme} from 'components'

export default class HeaderBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showLogutBtn: false,
    }
  }

  render () {
    const hideRightCon = this.props.hideRightCon || false;
    const {showLogutBtn} = this.state;
    const curUrl = '/consultRecord';
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
                <li
                  className={(curUrl.indexOf('/chating-page') > -1) || (curUrl.indexOf('/consultRecord') > -1) || (curUrl.indexOf('/chatOverPage') > -1) || (curUrl.indexOf('/chating-detail-page') > -1) ? 'left curLi' : 'left'}
                  onClick={() => {this.props.changeNav(1)}}>用药管理</li>
                <li
                  className={(curUrl.indexOf('/modify-pass') > -1) ? 'left curLi' : 'left'}
                  onClick={() => {this.props.changeNav(2)}}>用户管理</li>
                <li
                  className={(curUrl.indexOf('/order-records') > -1) || (curUrl.indexOf('/order-detail') > -1) ? 'left curLi' : 'left'}
                  onClick={() => {this.props.changeNav(3)}}>订单管理</li>
                <div className='clearfix'></div>
              </ul>
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
                  <article onClick={() => {this.props.clickLogout();}}>退出</article>
                </section>
              </div>
              <div className='clearfix'></div>
            </section>
        }
        {canlendarStyles()}
        <div className='clearfix'></div>
      </div>
    )
  }
}
