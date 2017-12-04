import React, { Component } from 'react'
import Router from 'next/router'
import { Loading, PageCard, FilterCard, KeywordCard } from '../../../components'
import { queryPayments, selectPayment } from '../../../ducks'
import { connect } from 'react-redux'

class PaymentListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      sortWay: null
    }
    this.type = '02'
  }

  componentWillMount () {
    this.queryPayments({})
  }

  queryPayments ({ page, sort, name, tradeNo }) {
    page = page || this.state.page
    name = name || this.state.name
    tradeNo = tradeNo || this.state.tradeNo
    const skip = (page - 1) * 10
    const { client, queryPayments } = this.props
    queryPayments(client, { skip, name, tradeNo })
  }

  getSortWay () {
    let array = [{ title: '按积分排序', value: 'score' }, { title: '按做题数排序', value: 'countPaymentAnswer' }]
    return array
  }

  getListData () {
    const { payments } = this.props
    const { page, name, tradeNo } = this.state
    const skip = (page - 1) * 10
    const limit = 10
    let array = []
    let index = -1
    let arr = []
    for (let key in payments) {
      arr.push(payments[key])
    }
    let srotWay = this.state.sortWay || 'id'
    arr = arr.sort((a, b) => b[srotWay] - a[srotWay])
    for (let payment of arr) {
      if (name) {
        let pattern = new RegExp(name)
        let username = payment.user.name
        let phone = payment.user.phone
        if (!pattern.test(phone) && !pattern.test(username)) continue
      }
      if (tradeNo) {
        let pattern = new RegExp(tradeNo)
        let key1 = payment.tradeNo
        let key2 = payment.outTradeNo
        if (!pattern.test(key1) && !pattern.test(key2)) continue
      }
      index++
      if (index < skip || index + 1 > skip + limit) {
        continue
      }
      array.push(Object.assign({}, payment, { key: payment.id, index }))
    }
    return array.sort((a, b) => b.createdAt - a.createdAt)
  }

  goToDetail (paymentId) {
    const { selectPayment } = this.props
    selectPayment({ paymentId })
    Router.push('/payment/edit')
  }

  renderTitle () {
    return (
      <ul className='flex tb-flex orderTitle'>
        <li className={'numberText titleText'}>序号</li>
        <li className={'subjectText titleText '}>手机号</li>
        <li className={'subjectText titleText '}>姓名</li>
        <li className={'subjectText titleText '}>用途</li>
        <li className={'subjectText titleText '}>商户订单号</li>
        <li className={'subjectText2 titleText '}>微信订单号</li>
        <li className={'subjectText titleText '}>金额</li>
        <li className={'subjectText titleText '}>支付状态</li>
        <li className={'subjectText titleText '}>业务状态</li>
        <li className={'subjectText1 titleText '}>支付时间</li>
        {/* <li className={'subjectText titleText'}>查看</li> */}
        <style jsx>{`
          .orderTitle {
            color: #797979;
            background: #f2f2f2;
            padding: 10px 15px;
            border-radius: 3px;
          }
          .titleText {
            padding: 0px, 10px;
            font-size: 16px;
          }
          .numberText {
            width: 5%;
            text-align: left;
          }
          .contentText {
            width: 50%;
            text-align: left;
          }
          .subjectText {
            width: 20%;
            text-align: center;
          }
          .subjectText1 {
            width: 40%;
            text-align: center;
          }
          .subjectText2 {
            width: 60%;
            text-align: center;
          }
        `}</style>
      </ul>
    )
  }

  renderRow (item, index) {
    return (
      <ul className='flex tb-flex listItem' key={item.id}>
        <li className={'numberText'}>{item.index + 1}</li>
        <li className={'subjectText'}>{item.user.phone || '无'}</li>
        <li className={'subjectText'}>{item.user.name || ''}</li>
        <li className={'subjectText'}>{item.type === 'MEMBER' ? '充值会员' : '充值积分'}</li>
        <li className={'subjectText'}>{item.outTradeNo || ''}</li>
        <li className={'subjectText2'}>{item.tradeNo || ''}</li>
        <li className={'subjectText'}>{item.totalFee} 元</li>
        <li className={'subjectText'}>{item.status === 'TRADE_SUCCESS' ? '支付成功' : '退款成功'}</li>
        <li className={'subjectText'}>{item.bussStatus ? '完成' : '未知'}</li>
        <li className={'subjectText1'}>{getTime(item.payTime)}</li>
        {/* <li className={'subjectText'}>
          <button className='fenyeItem' onClick={() => this.goToDetail(item.id)}>
            设置
          </button>
        </li> */}
        <style jsx>{`
          .numberText {
            width: 5%;
            text-align: left;
          }
          .contentText {
            width: 50%;
            text-align: left;
          }
          .subjectText {
            width: 20%;
            text-align: center;
          }
          .fenyeItem {
            background: #3ca0ff;
            border-radius: 2px;
            display: inline-block;
            cursor: pointer;
            border: 1px solid #3ca0ff;
            color: #fff;
          }
          .subjectText1 {
            width: 40%;
            text-align: center;
          }
          .subjectText2 {
            width: 60%;
            text-align: center;
          }
        `}</style>
      </ul>
    )
  }

  renderItem (value, key) {
    return (
      <li className={'left textoverflow1'} key={key} style={{ width: '30%', marginRight: 10 }}>
        {value || '无'}
      </li>
    )
  }

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
    }
    let exercises = this.getListData()
    return (
      <div className={'orderRecordsPage'}>
        <FilterCard>
          <KeywordCard
            config={{ placeholder: '手机号 / 姓名', keyword: this.state.keyword }}
            clickfilter={name => {
              this.setState({ name, page: 1 }, () => this.queryPayments({ page: 1, name }))
            }}
          />
          <KeywordCard
            config={{ placeholder: '商户订单号 / 微信订单号', keyword: this.state.keyword }}
            clickfilter={tradeNo => {
              this.setState({ tradeNo, page: 1 }, () => this.queryPayments({ page: 1, tradeNo }))
            }}
          />
        </FilterCard>
        {this.renderTitle()}
        {exercises.map((item, index) => {
          return this.renderRow(item, index)
        })}
        <PageCard
          data={exercises}
          page={this.state.page}
          clickPage={type => {
            const prevPage = this.state.page
            let curPage
            if (type === 'prev') {
              curPage = prevPage - 1
            } else if (type === 'next') {
              curPage = prevPage + 1
            } else {
              curPage = type
            }
            this.setState(
              {
                page: curPage
              },
              () => {
                this.queryPayments({})
              }
            )
          }}
        />
      </div>
    )
  }
}

function getTime (time) {
  if (!time) return ''
  return time.substr(0, 4) + '-' + time.substr(4, 2) + '-' + time.substr(6, 2) + ' ' + time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2)
}

function mapStateToProps (state) {
  return {
    payments: state.payments.data
  }
}

export default connect(mapStateToProps, { queryPayments, selectPayment })(PaymentListScreen)
