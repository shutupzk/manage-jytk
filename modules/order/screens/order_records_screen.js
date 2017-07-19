import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERTYPE} from 'config'
import {OrderTab, OrderListTopFilterCard, OrderListTitle, OrderListItem} from '../components'
import { queryOrderList } from '../../../ducks'
import { connect } from 'react-redux'


class OrderRecordsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: '', // 空 代表全部
      keyword: ''
    }
  }

  componentWillMount() {
    this.props.queryOrderList(this.props.client)
  }

  // 提交
  async submit (props) {
    let i = 2
    const password = this.state.password
    const code = this.state.verCode
    const phone = this.state.phone
    const repassword = this.state.repassword
    if (!phone) {
      this.setState({
        isShow: true,
        promptContent: '请输入手机号'
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
      // return console.log('', '请输入手机号')
    }
    if (phone.length !== 11) {
      this.setState({
        isShow: true,
        promptContent: '手机号格式不正确'
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
    }
    if (!code) {
      this.setState({
        isShow: true,
        promptContent: '请输入验证码'
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
    }
    // if (verCode !== '1234') {
    //   this.setState({
    //     isShow: true,
    //     promptContent: '验证码输入错误'
    //   })
    //   this.interval = setInterval(() => {
    //     if (i === 0) {
    //       clearInterval(this.interval)
    //       this.setState({ isShow: false, promptContent: '' })
    //     }
    //     i--
    //   }, 1000)
    //   return
    // }
    if (!password) {
      this.setState({
        isShow: true,
        promptContent: '请输入密码'
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
    }
    if (password.length < 8) {
      this.setState({
        isShow: true,
        promptContent: '密码长度不能小于8位'
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
    }
    if (password !== repassword) {
      this.setState({
        isShow: true,
        promptContent: '密码输入不一致，请重新输入'
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
    }
    // const error = await props.checkVerifyCode(props.client, {phone, code})
    // if (error) {
    //   this.setState({
    //     isShow: true,
    //     promptContent: error
    //   })
    //   this.interval = setInterval(() => {
    //     if (i === 0) {
    //       clearInterval(this.interval)
    //       this.setState({ isShow: false, promptContent: '' })
    //     }
    //     i--
    //   }, 1000)
    //   return
    // }
    const error = this.props.forgotPassword(this.props.client, {phone, password, code})
    if (error) {
      this.setState({
        isShow: true,
        promptContent: error
      })
      this.interval = setInterval(() => {
        if (i === 0) {
          clearInterval(this.interval)
          this.setState({ isShow: false, promptContent: '' })
        }
        i--
      }, 1000)
      return
    }
    Router.push('/sigin')
  }

  filterCard(orderlist) {
    const status = this.state.status;
    if (!status) return orderlist // status 空 代表全部
    let neworderlist = orderlist.filter((item) => item&&item.status === status)
    return neworderlist
  }

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
    }
    let orderlist = this.filterCard(this.props.orderlist)
    console.log('----orderlist', orderlist)
    return (
      <div className={'orderRecordsPage'}>
        <OrderListTopFilterCard status={this.state.status} changeStatus={(status) => {this.setState({status: status})}}
          changeKeyword={(keyword) => {this.setState({keyword: keyword})}} />
        <OrderTab status={this.state.status} changeStatus={(status) => {this.setState({status: status})}} />
        {/*<div className={styles.orderConTop + ' clearfix'}>
          <a className='right'>下一页</a>
          <a className='right'>上一页</a>
        </div>*/}
        <OrderListTitle />
        {
          orderlist && orderlist.length > 0 ?
            orderlist.map((orderItem, iKey) => {
              return (
                <div key={iKey}>
                  <OrderListItem data={orderItem} />
                </div>
              )
            })
          : 'no data'
        }
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    orderlist: state.order.data,
    loading: state.order.loading,
    error: state.order.error
  }
}

export default connect(mapStateToProps, { queryOrderList })(OrderRecordsScreen)
