import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import Router from 'next/router'
import _ from 'lodash'

import { queryMessageTypes, queryMessages, selectMessageType, queryLastMessage } from 'ducks'
import { Loading, ErrCard } from 'components'

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
      <div>
        {
          messageTypes.map((type) => {
            return (
              <div key={type.id} style={{marginBottom: 2, backgroundColor: '#FFF', padding: 10}}
                onClick={() => {
                  this.props.selectMessageType({typeId: type.id})
                  Router.push('/message_types/messages?typeId=' + type.id)
                }}
              >
                <div>{type.name}<span style={{float: 'right'}}>{type.read ? '已读' : '未读'}{moment(type.messageTime) < moment(moment().format('YYYY-MM-DD')) ? moment(type.messageTime).format('YYYY-MM-DD') : moment(type.messageTime).format('HH:mm')}</span></div>
                <div>{type.messages[0].content}</div>
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
