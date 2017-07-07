import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'

import {BlankLayout} from 'modules/common'
import { readMessage, queryMessages, selectMessageType } from 'ducks'
import { Loading, ErrCard } from 'components'
import { isEmptyObject } from 'utils'

class MessagesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      groupId: null
    }
  }
  componentWillMount () {
    if (isEmptyObject(this.props.messages)) {
      this.props.queryLastMessage(this.props.client, {limit: 0})
      this.props.selectMessageType({typeId: this.props.url.query.typeId})
    }
    this.props.readMessage(this.props.client, {typeId: this.props.messageTypeId})
  }
  getMessageList (messages) {
    let messageArr = []
    for (let message of messages) {
      if (message.messageTypeId === this.props.messageTypeId) {
        messageArr.push(message)
      }
    }
    return messageArr
  }
  render () {
    if (this.props.loading) {
      return (
        <Loading showLoading={this.props.loading} />
      )
    }
    // const messages = this.props.messages[this.props.messageTypeId].messages
    const messages = this.getMessageList(this.props.messages)
    return (
      <BlankLayout title={messages[0].messageType.name}>
        <div style={{margin: 15}}>
          {
            messages.map((msg) => {
              return (
                <div style={{marginBottom: 20}} key={msg.id}>
                  <div style={{textAlign: 'center'}}>{moment(msg.createdAt) < moment(moment().format('YYYY-MM-DD')) ? moment(msg.createdAt).format('YYYY-MM-DD') : moment(msg.createdAt).format('HH:mm')}</div>
                  <div style={{backgroundColor: '#fff', marginTop: 5, padding: 10, borderRadius: 5}}>
                    <div style={{fontSize: 16, padding: '5px 0px', fontWeight: 'bold'}}>{msg.messageType.name}</div>
                    {msg.content}
                  </div>
                </div>
              )
            })
          }
        </div>
      </BlankLayout>
    )
  }
}

function mapStateToProps (state) {
  return {
    loading: state.lastMessages.loading,
    error: state.lastMessages.error,
    messages: state.lastMessages.data,
    messageTypeId: state.lastMessages.selectId
  }
}

export default connect(mapStateToProps, { readMessage, queryMessages, selectMessageType })(MessagesScreen)
