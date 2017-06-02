import React, { Component } from 'react'
import { connect } from 'react-redux'

import {} from '../../../ducks'

class InpatientScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {

  }

  render () {
    if (this.props.loading) {
      return (<div>loading...</div>)
    }
    if (this.props.error) {
      return (<div>error...</div>)
    }
    return (
      <div>住院跟踪</div>
    )
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading,
    error: state.error
  }
}

export default connect(mapStateToProps, {})(InpatientScreen)
