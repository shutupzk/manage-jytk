import React, { Component } from 'react'
import localforage from 'localforage'
import { connect } from 'react-redux'
import Router from 'next/router'
import _ from 'lodash'
import { queryMyDoctors, setQueryFlag } from '../../../ducks'
import { DoctorList } from '../../hospital/components'
import { isEmptyObject } from '../../../utils'

// const filterUsers = (userIds, userId) => {
//   let ids = userIds.filter((id) => {
//     if (userId === id) {
//       return true
//     }
//     return false
//   })
//   if (ids.length > 0) {
//     return true
//   }
// }

class MyDoctorsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      userId: this.props.userId
    }
  }
  componentWillMount () {
    if (isEmptyObject(this.props.doctors) || this.props.queryFlag !== 'myDoctors') {
      this.getMyDoctors()
    }
  }

  async getMyDoctors () {
    this.setState({isInit: true})
    const userId = await localforage.getItem('userId')
    this.setState({query: true, userId})
    await this.props.queryMyDoctors(this.props.client, { userId })
    this.props.setQueryFlag({flag: 'myDoctors'})
    this.setState({isInit: false})
  }

  toUrl (docId) {
    Router.push('/profile/doctor_detail?doctorId=' + docId)
  }

  render () {
    // const userId = this.state.userId
    if (this.props.loading || this.state.isInit) {
      return <div>loading...</div>
    }
    console.log(this.props)
    var mydoctors = []
    _.mapValues(this.props.doctors, function (doc) {
      console.log(doc)
      if (doc.isMyDoctor) {
        mydoctors.push(doc)
      }
    })
    return (
      <div className='container'>
        <DoctorList doctors={mydoctors} userId={this.state.userId} toUrl={(docId) => { this.toUrl(docId) }} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    doctors: state.doctors.data,
    queryFlag: state.doctors.queryFlag,
    error: state.doctors.error,
    loading: state.doctors.loading
  }
}

export default connect(mapStateToProps, { queryMyDoctors, setQueryFlag })(MyDoctorsScreen)
