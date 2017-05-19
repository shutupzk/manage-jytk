import React, { Component } from 'react'
import localforage from 'localforage'
import { connect } from 'react-redux'
import _ from 'lodash'
import { queryMyDoctors } from '../../../ducks'
import DoctorList from '../../hospital/components/doctor_list'

class MyDoctorsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: false
    }
  }
  componentWillMount () {
    this.getMyDoctors()
  }

  async getMyDoctors () {
    if (!this.state.query) {
      const userId = await localforage.getItem('userId')
      this.setState({query: true})
      this.props.queryMyDoctors(this.props.client, { userId })
    }
  }

  render () {
    console.log(this.props.doctors)
    var mydoctors = []
    _.mapValues(this.props.doctors, function (doc) {
      console.log('doc', doc.userId)
      mydoctors.push(doc)
    })
    return (
      <div>
        <DoctorList doctors={mydoctors} toUrl='doctor_detail' />
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
