import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import Router from 'next/router'
import _ from 'lodash'

import { queryMessageTypes, queryMessages, selectMessageType, queryLastMessage } from 'ducks'
import { Loading, ErrCard, theme } from 'components'

class MessageTypesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      groupId: null
    }
  }
  componentWillMount () {
    this.props.queryLastMessage(this.props.client, {limit: 0})
  }
  getmessageTypeList (messageTypes) {
    let messageTypeArr = []
    for (let key in messageTypes) {
      messageTypeArr.push(messageTypes[key])
    }
    return messageTypeArr
  }
  getMessages (messages) {
    const messageGroup = _.groupBy(messages, 'messageTypeId')
    let messageArr = []
    _.each(_.keys(messageGroup), function (key) {
      let messageType = Object.assign({}, { id: key, name: messageGroup[key][0].messageType.name, code: messageGroup[key][0].messageType.code, messages: messageGroup[key], read: messageGroup[key][0].read, messageTime: messageGroup[key][0].createdAt })
      messageArr.push(messageType)
    })
    return messageArr
  }
  render () {
    if (this.props.loading) {
      return (
        <Loading showLoading={this.props.loading} />
      )
    }
    const messageTypes = this.getMessages(this.props.messages)
    console.log(messageTypes)
    return (
      <div style={{background: '#fff', borderTop: '1px solid #fff', borderColor: theme.bordercolor, marginTop: theme.tbmargin}}>
        {
          messageTypes.map((type) => {
            const imgUrl = '/static/icons/megtype' + type.code + '.png'
            return (
              <div key={type.id}
                style={{borderBottom: '1px solid #fff', borderColor: theme.bordercolor,
                  padding: '10px 15px',
                  color: theme.nfontcolor,
                  display: '-webkit-box'}}
                onClick={() => {
                  this.props.selectMessageType({typeId: type.id})
                  Router.push('/message_types/messages?typeId=' + type.id)
                }}
              >
                <article style={{height: 40, width: 40, paddingRight: theme.tbmargin, position: 'relative'}}>
                  <img src={imgUrl} style={{height: 40, width: 40}} />
                  {type.read ? <span style={{position: 'absolute', top: '-2px', left: '36px', width: 8, height: 8, background: '#f00', borderRadius: '100%'}}></span>
                  : ''}
                </article>
                <dl>
                  <dt>
                    <span style={{color: theme.mainfontcolor}}>{type.name}</span>
                    <span style={{float: 'right', fontSize: theme.nfontsize}}>{moment(type.messageTime) < moment(moment().format('YYYY-MM-DD')) ? moment(type.messageTime).format('YYYY-MM-DD') : moment(type.messageTime).format('HH:mm')}</span>
                  </dt>
                  <dd className='textoverflow1' style={{fontSize: 14}}>{type.messages[0].content}</dd>
                </dl>
                <style jsx>{`
                  dl{
                   -webkit-box-flex: 1;
                  }
                `}</style>
              </div>
            )
          })
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    loading: state.lastMessages.loading,
    error: state.lastMessages.error,
    messages: state.lastMessages.data
  }
}

export default connect(mapStateToProps, { queryMessageTypes, queryMessages, selectMessageType, queryLastMessage })(MessageTypesScreen)
