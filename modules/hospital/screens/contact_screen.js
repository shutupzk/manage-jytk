import React, { Component } from 'react'

import { CONTACT } from '../../../config'

class ContactScreen extends Component {
  renderCard () {
    return (
      <div>
        {
          CONTACT.map((contact, i) => (
            <div key={i}
              className={'containerStyle'}
            >
              <div className={'titleStyle'}>{contact.title}</div>
              <div>
                {
                  contact.values.map((value, j) => (
                    <div className={'text'} key={j}>{value}</div>
                  ))
                }
              </div>
            </div>
          ))
        }
        <style jsx>{`
          .titleStyle {
            color: #3CA0FF;
            align-self: flex-start;
          }
          .containerStyle {
            margin: 0px;
            margin-bottom: 10px;
          }
          .text {
            color: #505050;
            font-size: 14px;
            margin-vertical: 2px;
          }
        `}</style>
      </div>
    )
  }
  render () {
    return (
      <div>
        {
          this.renderCard()
        }
      </div>
    )
  }
}

export default ContactScreen
