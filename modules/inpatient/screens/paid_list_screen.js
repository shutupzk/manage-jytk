import React, { Component } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import moment from 'moment'

import { selectDeposit } from '../../../ducks'

class PaidListScreen extends Component {
  render () {
    // const list = [
    //   {title: '预缴金缴纳记录',
    //     date: '8月15日 12:00',
    //     fee: '¥20.02',
    //     payStatus: '微信支付',
    //     no: '383221231233123',
    //     inpatientNo: '1009660'
    //   },
    //   {title: '预缴金缴纳记录',
    //     date: '8月13日 12:00',
    //     fee: '¥500',
    //     payStatus: '支付宝',
    //     no: '383221231233125',
    //     inpatientNo: '1009660'
    //   }
    // ]
    const list = []
    console.log(this.props.deposits)
    console.log(this.props.selectInpatientId)
    for (let key in this.props.deposits) {
      if (this.props.selectInpatientId === this.props.deposits[key].patientId) {
        list.push(this.props.deposits[key])
      }
    }
    console.log(list)
    return (
      <div>
        <div>
          {
            list.map((item, i) => (
              <div
                style={{borderBottomWidth: 10}}
                key={i}
                onClick={() => {
                  this.props.selectDeposit(item.id)
                  Router.push('/inpatient/paid_detail')
                }}
              >
                <div>{title(item, i)}</div>
              </div>
            ))
         }
        </div>
      </div>
    )
  }
}

const title = (item, i) => {
  return (
    <div style={{margin: 10, backgroundColor: '#ffffff', borderRadius: 10, padding: 10}}>
      <div style={{color: '#505050', fontSize: 16}}>{'预缴金缴纳记录'}</div>
      <div style={{color: '#797979', fontSize: 13, marginTop: 6}}>{moment(item.createdAt).format('MM月DD日 HH:mm')}</div>
      <div style={{flexDirection: 'row', justifyContent: 'center', marginTop: 14, marginBottom: 20}}>
        <div style={{color: '#797979', fontSize: 30, textAlign: 'center'}}>{`￥  ${item.charge}`}</div>
      </div>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <div style={{color: '#797979', fontSize: 13, flex: '2'}}>支付方式</div>
        <div style={{color: '#505050', fontSize: 13, flex: '9'}}>{item.payWay}</div>
      </div>
      <div style={{flexDirection: 'row', marginTop: 7, display: 'flex'}}>
        <div style={{color: '#797979', fontSize: 13, flex: '2'}}>凭证单号</div>
        <div style={{color: '#505050', fontSize: 13, flex: '9'}}>{item.tradeNo}</div>
      </div>
      <div style={{flexDirection: 'row', marginTop: 7, display: 'flex'}}>
        <div style={{color: '#797979', fontSize: 13, flex: '2'}}>住院号</div>
        <div style={{color: '#505050', fontSize: 13, marginLeft: 5, flex: '9'}}>{item.inpatientNo}</div>
      </div>
      <div className='spliteLine'>&nbsp;</div>
      <div style={{marginTop: 5}}>{subtitle()}</div>
      <style jsx>{`
        .spliteLine {
          background-color: #E6E6E6;
          width: 100%;
          height: 1px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  )
}

const subtitle = () => {
  return (
    <div>
      <div style={{ flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ fontSize: 14, color: '#505050' }} >查看详情<span style={{float: 'right'}}>></span></div>
      </div>
    </div>
  )
}

function mapStateToProps (state) {
  return {
    userId: state.user.data.id,
    inpatientId: state.inpatient.selectInpatientId,
    selectInpatientId: state.inpatient.selectInpatientId,
    inpatients: state.inpatient.data,
    deposits: state.deposit.data,
    loading: state.deposit.loading,
    error: state.deposit.error
  }
}

// export default PaidListScreen
export default connect(mapStateToProps, { selectDeposit })(PaidListScreen)
