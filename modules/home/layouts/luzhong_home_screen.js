import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Router from 'next/router'
import moment from 'moment'
import {HOME_PAGE} from 'config'
import { CardWhite, Loading, ErrCard, theme, NoDataCard, Prompt } from 'components'
import {home_styles} from './home_styles'

class LuZhongHome extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount () {
    // this.getUserCookie()
  }

  render () {
    return (
      <div>
        luZhongHome
        {home_styles()}
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
  }
}
export default connect(mapStateToProps, {})(LuZhongHome)
