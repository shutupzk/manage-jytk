import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard, PageCard} from 'components'
import {ORDERINFO} from 'config'
import {fuzzyQuery} from 'utils'
import {OrderTab, OrderListItem, OrderTipModal} from '../components'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryOrderList, showPrompt } from '../../../ducks'
import { connect } from 'react-redux'


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
    let error = await this.props.queryOrderList(this.props.client, {limit: 10, skip: (this.state.page - 1) * 10})
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
  }

	async clickModalOk() {
		const {selectOrder, modalType} = this.state;
		let error;
		if (modalType === 'cancel') {
			error = await this.props.cancelAppointment(this.props.client, {id: selectOrder.id})
		}
		this.setState({showModal: false, selectOrder: {}})
		if (error) {
			this.props.showPrompt({text: error})
			return
		}
		this.queryOrderList()
	}

  filterCard(orderlist) {
		let filterOrderList = orderlist
		if (this.state.keyword) {
			filterOrderList = fuzzyQuery(filterOrderList, this.state.keyword, ['title', 'summary'])
		}
		if (this.state.status) {
			filterOrderList = filterOrderList.filter((orderItem) => {return orderItem.status === this.state.status})
		}
		return filterOrderList
  }

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
    }
    let orderlist = this.filterCard(this.props.orderlist)
    return (
      <div className={'orderRecordsPage'}>
				<FilterCard>
					<SelectFilterCard
						data={ORDERINFO.order_type}
						status={this.state.status}
						config= {{selectTitle: '全部订单类型', valueKey: 'value', titleKey: 'title'}}
						changeStatus={(status) => {
              this.setState({
                page: 1, status: status
              }, () => {
                this.queryOrderList()
              })}
            } />
					{/* <KeywordCard
						config={{placeholder: '资讯标题／资讯类型'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword})}} /> */}
				</FilterCard>
        {renderModal(this)}
        <OrderTab status={this.state.status} changeStatus={(status) => {this.setState({
            page: 1, status: status
          }, () => {
            this.queryOrderList()
          })}} />
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
            const prevPage = this.state.page
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
			clickModalOk={() => self.clickModalOk()}>
			<dl style={{padding: '.2rem .25rem', color: theme.fontcolor, marginTop: theme.tbmargin, borderTop: `1px solid ${theme.bordercolor}`, fontSize: 13, lineHeight: '.3rem'}}>
				<dt><span>患者姓名：</span>{selectOrder.patientName}</dt>
				<dt><span>就诊时间：</span>{selectOrder.visitSchedule && selectOrder.visitSchedule.visitDate}</dt>
				<dd style={{fontSize: 14, paddingTop: 10, color: theme.mainfontcolor}}>您确定要<span style={{color: '#f00'}}>退款</span>吗？</dd>
			</dl>
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

export default connect(mapStateToProps, { queryOrderList, showPrompt })(OrderRecordsScreen)
