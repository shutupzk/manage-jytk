
import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import _ from 'lodash'
// import Link from 'next/link'
// import * as actions from '../../../ducks'
export default class DepartmentDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.toDetail = false
  }
  static async getInitialProps (context) {
    console.log(context)
    console.log('aaa')
    return {usr: 'baek'}
  }
  render () {
    return (
      <div>
        department detail
      </div>
    )
  }
}
// DepartmentDetail.getInitialProps = async function (context) {
//   console.log(context)
//   console.log('aaa')
//   return {}
// }

export {
  DepartmentDetailScreen
}
