import React, {Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import localforage from 'localforage'
// import Link from 'next/link'
import { queryPatients, selectPatient, queryPayments, selectPayment } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
import {theme, Loading, ErrCard, NoDataCard} from 'components'
class DepositRecordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount () {
    this.props.queryPayments(this.props.client)
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
    const payments = this.props.payments
    var paymentArr = []
    for (var i in payments) {
      paymentArr.push(payments[i])
    }
    return (
      <div>
        { paymentArr.length > 0 ? paymentArr.map((payment, i) => {
          return (
            <div key={payment.id}
              style={{backgroundColor: '#fff', padding: theme.lrmargin, borderBottom: '1px solid #fff', borderColor: theme.bordercolor}}
              onClick={() => {
                this.props.selectPayment(payment.id)
                Router.push('/profile/deposit_detail?payment=' + payment.id)
              }}
            >
              <div style={{fontSize: theme.fontsize, color: theme.mainfontcolor, marginBottom: 6}}>{payment.typeName}<span style={{float: 'right', fontWeight: '600', color: theme.mainfontcolor, fontSize: 18}}>-{payment.totalCharge}</span></div>
              <div style={{fontSize: theme.nfontsize, color: theme.nfontcolor}}>{payment.createdAt}</div>
            </div>
          )
        }) : <NoDataCard />
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    payments: state.payments.data,
    loading: state.payments.loading,
    error: state.payments.error
  }
}

export default connect(mapStateToProps, { queryPatients, selectPatient, queryPayments, selectPayment })(DepositRecordScreen)
