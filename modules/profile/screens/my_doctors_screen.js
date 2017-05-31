import React, { Component } from 'react'
import localforage from 'localforage'
import { connect } from 'react-redux'
import Router from 'next/router'
import _ from 'lodash'
import { queryMyDoctors } from '../../../ducks'
import { DoctorList } from '../../hospital/components'

const filterUsers = (userIds, userId) => {
  let ids = userIds.filter((id) => {
    if (userId === id) {
      return true
    }
    return false
  })
  if (ids.length > 0) {
    return true
  }
}

class MyDoctorsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: false,
      userId: this.props.userId
    }
  }
  componentWillMount () {
    this.getMyDoctors()
  }

  async getMyDoctors () {
    if (!this.state.query) {
      const userId = await localforage.getItem('userId')
      this.setState({query: true, userId})
      this.props.queryMyDoctors(this.props.client, { userId })
    }
  }

  toUrl (docId) {
    Router.push('/profile/doctor_detail?doctorId=' + docId)
  }

  render () {
    const userId = this.state.userId
    var mydoctors = []
    _.mapValues(this.props.doctors, function (doc) {
      if (filterUsers(doc.userIds, userId)) {
        mydoctors.push(doc)
      }
    })
    return (
      <div className='container'>
        <DoctorList doctors={mydoctors} toUrl={(docId) => { this.toUrl(docId) }} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    doctors: state.doctors.data,
    error: state.doctors.error,
    loading: state.doctors.loading
  }
}

export default connect(mapStateToProps, { queryMyDoctors })(MyDoctorsScreen)
