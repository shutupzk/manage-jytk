import React, {Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import localforage from 'localforage'
// import Link from 'next/link'
import { queryPatients, selectPatient, queryDeposits, selectDeposit } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
class DepositRecordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount () {
    const patientId = this.props.patientId
    if (patientId) {
      if (isEmptyObject(this.props.deposits)) {
        this.props.queryDeposits(this.props.client, {patientId})
      }
    } else {
      this.queryPatient(this.props)
    }
  }

  async queryPatient () {
    const patients = this.props.patientsData
    if (isEmptyObject(patients)) {
      var userId = await localforage.getItem('userId')
      await this.props.queryPatients(this.props.client, {userId})
    }
    let array = []
    for (let i in this.props.patientsData) {
      if (this.props.patientsData[i] && this.props.patientsData[i].id) {
        array.push(this.props.patientsData[i])
      }
    }
    if (array.length > 0) {
      this.props.selectPatient({patientId: array[0].id})
      this.props.queryDeposits(this.props.client, {patientId: array[0].id})
    }
  }
  render () {
    if (this.props.loading) {
      return (
        <div>
          loading...
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          error...
        </div>
      )
    }
    const deposits = this.props.deposits
    var depositArr = []
    if (deposits) {
      for (var i in deposits) {
        depositArr.push(deposits[i])
      }
    }
    return (
      <div>
        { depositArr.length > 0 ? depositArr.map((deposit, i) => {
          return (
            <div key={deposit.id}
              style={{backgroundColor: '#ffffff', padding: 10, marginBottom: 1}}
              onClick={() => {
                this.props.selectDeposit(deposit.id)
                Router.push('/profile/deposit_detail?depositId=' + deposit.id)
              }}
            >
              <div style={{fontSize: 14}}>{'挂号缴费'}<span style={{float: 'right'}}>-{deposit.charge}</span></div>
              <div>{deposit.date}</div>
            </div>
          )
        }) : 'no data'
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    deposits: state.deposit.data,
    patientsData: state.patients.data,
    patientId: state.patients.selectId,
    loading: state.patients.loading || state.deposit.loading,
    error: state.patients.error || state.deposit.error
  }
}

export default connect(mapStateToProps, { queryPatients, selectPatient, queryDeposits, selectDeposit })(DepositRecordScreen)
