import React, { Component } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import moment from 'moment'
import {theme} from 'components'

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
    <div style={{margin: 10, backgroundColor: '#ffffff', borderRadius: 4, padding: '10px 0', border: '1px solid #fff', borderColor: theme.bordercolor}}>
      <div style={{color: theme.mainfontcolor, fontSize: 16, fontWeight: '500', paddingLeft: theme.lrmargin, margin: '6px 0'}}>{'预缴金缴纳记录'}</div>
      <div style={{color: theme.fontcolor, fontSize: theme.nfontsize, paddingLeft: theme.lrmargin}}>{moment(item.createdAt).format('MM月DD日 HH:mm')}</div>
      <div style={{flexDirection: 'row',fontSize: 30, textAlign: 'center', borderBottom: '1px dashed #eee', margin: '0 .1rem', lineHeight: '80px', color: theme.mainfontcolor}}>
        {`￥  ${item.charge}`}
      </div>
      <div style={{padding: '10px 15px'}}>
        <div style={{flexDirection: 'row', display: 'flex'}}>
          <div style={{color: theme.fontcolor, fontSize: theme.nfontsize, flex: '2'}}>支付方式</div>
          <div style={{color: theme.mainfontcolor, fontSize: theme.nfontsize, flex: '9'}}>{item.payWay}</div>
        </div>
        <div style={{flexDirection: 'row', marginTop: 7, display: 'flex'}}>
          <div style={{color: theme.fontcolor, fontSize: theme.nfontsize, flex: '2'}}>凭证单号</div>
          <div style={{color: theme.mainfontcolor, fontSize: theme.nfontsize, flex: '9'}}>{item.tradeNo}</div>
        </div>
        <div style={{flexDirection: 'row', marginTop: 7, display: 'flex'}}>
          <div style={{color: theme.fontcolor, fontSize: theme.nfontsize, flex: '2'}}>住院号</div>
          <div style={{color: theme.mainfontcolor, fontSize: theme.nfontsize, marginLeft: 5, flex: '9'}}>{item.inpatientNo}</div>
        </div>
      </div>
      <div className='spliteLine'>&nbsp;</div>
      <div style={{marginTop: theme.tbmargin}}>{subtitle()}</div>
      <style jsx>{`
        .spliteLine {
          background-color: #E6E6E6;
          width: 100%;
          height: 1px;
        }
      `}</style>
    </div>
  )
}

const subtitle = () => {
  return (
    <div className='flex tb-flex' style={{ justifyContent: 'space-between', padding: '0 .15rem' }}>
      <span style={{ fontSize: 14, color: theme.mainfontcolor }}>查看详情</span>
      <p className='back-left' style={{transform: 'rotate(135deg)'}}></p>
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
