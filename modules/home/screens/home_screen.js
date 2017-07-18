import React, { Component } from 'react'
import {HOSPITAL_NAME} from 'config'
import {HeaderBar} from 'components'
import {
  LuZhongHome
} from '../layouts'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div>
        <HeaderBar />
        {
          HOSPITAL_NAME.indexOf('鲁中医院') > -1 ?
            <LuZhongHome {...this.props} />
          : ''
        }
      </div>
    )
  }
}
export default Home
