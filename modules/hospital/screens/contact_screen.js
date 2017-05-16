import React, { Component } from 'react'

import { CONTACT } from '../../../config'

class ContactScreen extends Component {
  renderCard () {
    return (
      <div>
        {
          CONTACT.map((contact, i) => (
            <div key={i}
              style={styles.containerStyle}
            >
              <div style={styles.titleStyle}>{contact.title}</div>
              <div>
                {
                  contact.values.map((value, j) => (
                    <div style={styles.text} key={j}>{value}</div>
                  ))
                }
              </div>
            </div>
          ))
        }
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

const styles = {
  titleStyle: {
    color: '#3CA0FF',
    alignSelf: 'flex-start'
  },
  containerStyle: {
    margin: 0,
    marginBottom: 10
  },
  text: {
    color: '#505050',
    fontSize: 14,
    marginVertical: 2
  }
}

export default ContactScreen
