import React, {Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import localforage from 'localforage'
// import Link from 'next/link'
import { queryPatients, selectPatient, queryDeposits, selectDeposit } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
import {theme, Loading, ErrCard} from 'components'
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
          <Loading showLoading={true} />
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <ErrCard />
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
              style={{backgroundColor: '#fff', padding: theme.lrmargin, borderBottom: '1px solid #fff', borderColor: theme.bordercolor}}
              onClick={() => {
                this.props.selectDeposit(deposit.id)
                Router.push('/profile/deposit_detail?depositId=' + deposit.id)
              }}
            >
              <div style={{fontSize: theme.fontsize, color: theme.mainfontcolor, marginBottom: 6}}>{'挂号缴费'}<span style={{float: 'right', fontWeight: '600', color: theme.mainfontcolor, fontSize: 18}}>-{deposit.charge}</span></div>
              <div style={{fontSize: theme.nfontsize, color: theme.nfontcolor}}>{deposit.date}</div>
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
