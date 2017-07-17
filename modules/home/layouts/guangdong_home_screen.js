import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Router from 'next/router'
import moment from 'moment'
import {HOME_PAGE} from 'config'
import { CardWhite, Loading, ErrCard, theme, NoDataCard } from 'components'
import {
  getUserCookie,
  queryMessageTypes,
  queryMessages,
  selectMessageType,
  queryLastMessage
} from '../../../ducks'
import {home_styles} from './home_styles'

class GuangDongHome extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      groupId: null
    }
  }
  componentWillMount () {
    this.props.queryLastMessage(this.props.client, {limit: 3})
    this.props.getUserCookie()
  }
  goHospitalPage () {
    console.log('====')
    Router.push('/hospital')
  }
  render () {
    if (this.props.messageLoading || this.state.isInit) {
      return (<div><Loading showLoading /></div>)
    }
    // if (this.props.error) {
    //   return (<ErrCard content={this.props.error} />)
    // }
    console.log(this.props.user)
    console.log(this.props.cookie)
    // window.alert(this.props.user)
    // window.alert(this.props.cookie)
    const messages = this.props.messages || []
    // let hospital = this.getHospital(this.props.hospitals)
    return (
      <div>
        <img src='/static/icons/banner3.png' style={{width: '100%'}} />
        <CardWhite classChild='nav'>
          <Link href={HOME_PAGE.grid_module[0].navigateName}><a>
            <section className='navLeft'>
              <h3 style={{margin: '.1rem 0'}}>{HOME_PAGE.grid_module[0].title}</h3>
							<img src={HOME_PAGE.grid_module[0].avatar} style={{width: 74, paddingTop: 26, paddingBottom: 44}} />
            </section>
          </a></Link>
          {
            [0, 2].map((itemcon) => {
              return (
                <section className='navRight' key={itemcon}>
                  {
                    HOME_PAGE.grid_module.slice(itemcon+1, itemcon+3) && HOME_PAGE.grid_module.slice(itemcon+1, itemcon+3).map((item, iKey) => {
                      return (
                        <Link href={item.navigateName} key={iKey}><a>
                          <article style={{borderBottom: '1px solid #fff',  borderColor: iKey === 0 || iKey === 2 ? theme.bordercolor : '#fff'}}>
                            <header className='flex lr-flex tb-flex' style={{width: '100%', paddingTop: 20, height: 50}}>
                              <img src={item.avatar} style={item.imgStyle || {width: 38}} />
                            </header>
                            <h3>{item.title}</h3>
                          </article>
                        </a></Link>
                      )
                    })
                  }
                </section>
              )
            })
          }
        </CardWhite>
        <div onClick={() => { this.goHospitalPage() }}>
          <CardWhite classChild='hospitalCenter flex tb-flex'>
            <img src={HOME_PAGE.hospital.avatar} alt='' className='hosbgimg' style={{padding: 0, height: '1rem'}} />
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
        <CardWhite>
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
        </CardWhite>
        {home_styles()}
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    cookie: state.user.data.cookie,
    user: state.user.data,
    error: state.user.error,
    messageLoading: state.lastMessages.loading || state.user.loading,
    messageError: state.lastMessages.error,
    messages: state.lastMessages.data
  }
}
export default connect(mapStateToProps, {queryMessageTypes,
  queryMessages,
  selectMessageType,
  queryLastMessage,
  getUserCookie})(GuangDongHome)
