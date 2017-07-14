import React, { Component } from 'react'
import {HOSPITAL_NAME} from 'config'
import {
  XianLinHome,
	GuangDongHome,
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
        {
          HOSPITAL_NAME.indexOf('广东省人民医院') > -1 ?
            <GuangDongHome {...this.props} />
          : ''
        }
        {
          HOSPITAL_NAME.indexOf('泰康仙林鼓楼医院') > -1 ?
            <XianLinHome {...this.props} />
          : ''
        }
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
