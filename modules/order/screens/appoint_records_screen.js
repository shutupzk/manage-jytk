import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard} from 'components'
import {ORDERINFO} from 'config'
import {fuzzyQuery} from 'utils'
import { AppointListItem, OrderTipModal} from '../components'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryAppointments, showPrompt, cancelAppointment } from '../../../ducks'
import { connect } from 'react-redux'


class AppointRecordsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			status: '',
			keyword: '',
			selectedAppoint: {},
			showModal: false
    }
  }

  componentWillMount() {
    this.props.queryAppointments(this.props.client)
	}

	async clickModalOk() {
		const {selectedAppoint, modalType} = this.state;
		let error;
		if (modalType === 'cancel') {
			error = await this.props.cancelAppointment(this.props.client, {id: selectedAppoint.id})
		}
		this.setState({showModal: false, selectedAppoint: {}})
		if (error) {
			this.props.showPrompt({text: error})
			return
		}
		await this.props.queryAppointments(this.props.client)
	}

  filterCard(appointments) {
		let filterAppointments = appointments
		if (this.state.keyword) {
			filterAppointments = fuzzyQuery(filterAppointments, this.state.keyword, ['patientName'])
		}
		if (this.state.status) {
			filterAppointments = filterAppointments.filter((appointmentItem) => {return appointmentItem.visitStatus === this.state.status})
		}
		return filterAppointments
  }

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
    }
		let appointments = this.filterCard(this.props.appointments)
		let modalConHtml;
    return (
      <div className={'orderRecordsPage'}>
				<FilterCard>
					<SelectFilterCard
						data={ORDERINFO.appoint_visit_status}
						status={this.state.status}
						config= {{selectTitle: '全部支付状态', valueKey: 'value', titleKey: 'title'}}
						changeStatus={(status) => {this.setState({status: status})}} />
					<KeywordCard
						config={{placeholder: '患者姓名'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword})}} />
				</FilterCard>
				{renderModal(this)}
        {/* <div className={'orderConTop'} style={{marginBottom: theme.tbmargin}}>
          <button className='right btnBGGray btnBGLitt'
            style={{height: '.24rem', lineHeight: '.24rem',backgroundImage: 'linear-gradient(-180deg, #FAFAFA 0%, #F2F2F2 100%)', 
              border: `1px solid ${theme.nbordercolor}`, borderRadius: 2, marginRight: theme.tbmargin, fontSize: 12, color: theme.mainfontcolor}}>下一页</button>
          <button className='right btnBGGray btnBGLitt'
            style={{height: '.24rem', lineHeight: '.24rem', backgroundImage: 'linear-gradient(-180deg, #FAFAFA 0%, #F2F2F2 100%)',
            border: `1px solid ${theme.nbordercolor}`, borderRadius: 2, marginRight: theme.tbmargin, fontSize: 12, color: theme.mainfontcolor}}>上一页</button>
          <p className='clearfix'></p>
        </div> */}
        <ListTitle data={ORDERINFO.appoint_list_title} />
        {
          appointments && appointments.length > 0 ?
            appointments.map((appointmentItem, iKey) => {
              return (
								<AppointListItem data={appointmentItem} key={iKey}
									titleInfo={ORDERINFO.appoint_list_title}
									clickConfirm={(data, modalType) => {
										this.setState({selectedAppoint: data, modalType: modalType})
										if (modalType === 'detail') {
											Router.push(`/order/appoint_detail?id=${data.id}&hospitalName=${data.hospital && data.hospital.hospitalName}`)
										} else {
											this.setState({
												showModal: true
											})
										}
									}} />
              )
            })
          : 'no data'
        }
      </div>
    )
  }
}

const renderModal = (self) => {
	const {selectedAppoint, showModal} = self.state;
	return (
		<OrderTipModal showModalState={showModal}
			onHide={() => self.setState({selectedAppoint: {}, showModal: false})}
			clickModalOk={() => self.clickModalOk()}>
			<dl style={{padding: '.2rem .25rem', color: theme.fontcolor, marginTop: theme.tbmargin, borderTop: `1px solid ${theme.bordercolor}`, fontSize: 13, lineHeight: '.3rem'}}>
				<dt><span>患者姓名：</span>{selectedAppoint.patientName}</dt>
				<dt><span>就诊时间：</span>{selectedAppoint.visitSchedule && selectedAppoint.visitSchedule.visitDate}</dt>
				<dd style={{fontSize: 14, paddingTop: 10, color: theme.mainfontcolor}}>您确定要<span style={{color: '#f00'}}>取消</span>该挂号吗？</dd>
			</dl>
		</OrderTipModal>
	)
}

function mapStateToProps (state) {
  return {
    appointments: state.appointments.data.appointments,
    loading: state.order.loading,
		error: state.order.error,
		appointment: state.appointments.data.appointment
  }
}

export default connect(mapStateToProps, { queryAppointments, showPrompt, cancelAppointment })(AppointRecordsScreen)