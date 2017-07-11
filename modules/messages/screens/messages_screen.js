import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'

import {BlankLayout} from 'modules/common'
import { readMessage, queryMessages, selectMessageType } from 'ducks'
import { Loading, ErrCard, theme } from 'components'
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
                <div style={{marginBottom: 10}} key={msg.id}>
                  <div style={{textAlign: 'center', color: theme.nfontcolor, fontSize: theme.nfontsize, lineHeight: '30px'}}>{moment(msg.createdAt) < moment(moment().format('YYYY-MM-DD')) ? moment(msg.createdAt).format('YYYY-MM-DD') : moment(msg.createdAt).format('HH:mm')}</div>
                  <div style={{backgroundColor: '#fff', padding: '0 15px 10px', borderRadius: 6, border: '1px solid #e6e6e6', color: theme.mainfontcolor}}>
                    <div style={{fontSize: 16, fontWeight: 'bold', padding: '15px 0 10px'}}>{msg.messageType.name}</div>
                    <p style={{lineHeight: '20px'}}>{msg.content}</p>
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
