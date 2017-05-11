import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../ducks'

class DoctorScreen extends Component {
  // constructor (props) {
  //   super(props)
  // }
  componentWillMount () {
    this.queryData()
  }
  queryData () {
    this.props.queryDoctors()
  }

  render () {
    console.log(this.props)
    return (
      <div>doctor</div>
    )
  }
}

function mapStateToProps (state) {
  return {
    doctor: state.doctors
  }
}

export default connect(
  mapStateToProps, actions
)(DoctorScreen)