import React, { Component } from 'react'
// import { Router } from '../../../routes'
// import {Link} from 'next/router'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard, PageCard} from 'components'
import {ORDERINFO} from 'config'
import {fuzzyQuery} from 'utils'
import {OrderTab, OrderListItem, OrderTipModal} from '../components'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryOrderList, showPrompt, updateConsultation } from '../../../ducks'
import { connect } from 'react-redux'

let filterOrderType = [
  {title: '待支付', value: ['01']},
  {title: '待退款', value: ['05']},
  {title: '待执行', value: ['03']},
  {title: '执行中', value: ['04']},
  {title: '已完成', value: ['07']},
  {title: '已关闭', value: ['02', '08', '09', '10', '06']}]

class OrderRecordsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: '', // 空 代表全部
      keyword: '',
      selectOrder: {},
      showModal: false,
      page: 1,
    }
  }

  componentWillMount() {
    this.queryOrderList()
  }

  async queryOrderList() {
    let status = this.state.status
    let keyword = this.state.keyword
    if (!status) {
      status = null
    }
    let error = await this.props.queryOrderList(this.props.client, {limit: 10, skip: (this.state.page - 1) * 10, status, keyword})
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
  }

	async clickModalOk(reason, refundRemark) {
		const {selectOrder} = this.state;
		let error = await this.props.updateConsultation(this.props.client, {id: selectOrder.id, status: '10', refundReason: reason, refundRemark: refundRemark})
		this.setState({showModal: false, selectOrder: {}})
		if (error) {
			this.props.showPrompt({text: error})
			return
    }
    this.props.showPrompt({text: '退款成功'})
		this.queryOrderList()
  }
  
  changeStatus(status) {
    this.setState({
      page: 1, status: status
    }, () => {
      this.queryOrderList()
    })
  }

  render () {
    // if (this.props.loading) {
    //   return <Loading showLoading />
    // }
    let orderlist = this.props.orderlist
    return (
      <div className={'orderRecordsPage'}>
        <Loading showLoading={this.props.loading} />
				<FilterCard>
					<SelectFilterCard
						data={filterOrderType}
						status={this.state.status}
						config= {{selectTitle: '全部订单类型', valueKey: 'value', titleKey: 'title'}}
						changeStatus={(status) => this.changeStatus(status)} />
					 <KeywordCard
						config={{placeholder: '订单编号/患者姓名/手机号'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword}, () => {this.queryOrderList()})}} />
            <span style={{float: 'right', fontSize: 12, lineHeight: '30px', cursor: 'pointer'}} onClick={() => Router.push('/order/order_help?id=')}>问题和帮助QA</span> 
				</FilterCard>
        {renderModal(this)}
        <OrderTab data={filterOrderType} status={this.state.status} changeStatus={(status) => this.changeStatus(status)} />
        {/* <div className={'orderConTop'} style={{marginBottom: theme.tbmargin}}>
          <button className='right btnBGGray btnBGLitt'
            style={{height: '.24rem', lineHeight: '.24rem',backgroundImage: 'linear-gradient(-180deg, #FAFAFA 0%, #F2F2F2 100%)', 
              border: `1px solid ${theme.nbordercolor}`, borderRadius: 2, marginRight: theme.tbmargin, fontSize: 12, color: theme.mainfontcolor}}>下一页</button>
          <button className='right btnBGGray btnBGLitt'
            style={{height: '.24rem', lineHeight: '.24rem', backgroundImage: 'linear-gradient(-180deg, #FAFAFA 0%, #F2F2F2 100%)',
            border: `1px solid ${theme.nbordercolor}`, borderRadius: 2, marginRight: theme.tbmargin, fontSize: 12, color: theme.mainfontcolor}}>上一页</button>
          <p className='clearfix'></p>
        </div> */}
        <ListTitle data={ORDERINFO.order_list_title} />
        {
          orderlist && orderlist.length > 0 ?
            orderlist.map((orderItem, iKey) => {
              return (
                <OrderListItem data={orderItem} key={iKey}
                  clickConfirm={(data) => {
                    this.setState({selectOrder: data, showModal: true})
                  }} />
              )
            })
          : 'no data'
        }
        <PageCard data={orderlist} page={this.state.page}
          clickPage={(type) => {
            const prevPage = parseInt(this.state.page, 10)
            let curPage
            if (type === 'prev') {
              curPage = prevPage - 1
            } else if (type === 'next') {
              curPage = prevPage + 1
            } else {
              curPage = type
            }
            this.setState({
              page: curPage
            }, () => {
              this.queryOrderList()
            })
          }} />
      </div>
    )
  }
}

const renderModal = (self) => {
  const {selectOrder, showModal} = self.state;
	return (
		<OrderTipModal showModalState={showModal}
			onHide={() => self.setState({selectOrder: {}, showModal: false})}
			clickModalOk={(refundReason, refundRemark) => self.clickModalOk(refundReason, refundRemark)}
      selectOrder={selectOrder}>
		</OrderTipModal>
	)
}


function mapStateToProps (state) {
  return {
    orderlist: state.order.data,
    loading: state.order.loading,
    error: state.order.error
  }
}

export default connect(mapStateToProps, { queryOrderList, showPrompt, updateConsultation })(OrderRecordsScreen)
