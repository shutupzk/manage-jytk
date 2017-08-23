import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, PageCard} from 'components'
import {ORDERINFO, DOCTORINFO, HOSPITALINFO} from 'config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryDoctorSchedules, showPrompt } from '../../../ducks'
import { connect } from 'react-redux'
import {ManageListItem, ManageDoctorModal} from '../components'
import {apTh} from '../config'


class ManageAllScheduleScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    this.queryDoctorSchedules()
  }

	async queryDoctorSchedules() {
		let error = await this.props.queryDoctorSchedules(this.props.client)
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
	}

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		if (this.props.error) {
			// this.props.showPrompt(this.props.error)
			// return console.log(this.props.error)
			return <div>{this.props.error}</div>
		}
		let curHaderItemStyle = {
			borderBottom: `4px solid ${theme.maincolor}`,
			color: theme.maincolor,
			paddingBottom: theme.midmargin,
			marginRight: theme.tbmargin, cursor: 'pointer'
		}
    return (
      <div>
				<div style={{borderBottom: `1px solid ${theme.bordercolor}`, width:'80%', fontSize: theme.nfontsize, color: theme.nfontcolor}}>
					<span className='left' style={curHaderItemStyle}
						>快速图文问诊</span>
					<p className='clearfix'></p>
				</div>
				{tableView(this)}
      </div>
    )
  }
}

const tableView = (self) => {
	const tableTh = [
		{title: '', width: '20px', height: '94px', value: 0},
		{title: '一', width: '14%', value: 1},
		{title: '二', width: '14%', value: 2},
		{title: '三', width: '14%', value: 3},
		{title: '四', width: '14%', value: 4},
		{title: '五', width: '14%', value: 5},
		{title: '六', width: '14%', value: 6},
		{title: '日', width: '14%', value: 7}
	]
	const fastSchedules = self.props.fastSchedules || {}
	return (
		<table className='left' style={{cellPadding: 0, borderSpacing: 0, margin: `${theme.lrmargin} 0`, width: '90%'}}>
			<tr className='flex'>
				{
					tableTh.map((item, iKey) => {
						return (
							<th className='flex tb-flex lr-flex' style={{background: '#E8EEFA', lineHeight: '30px', width: item.width}} key={iKey}>
								{item.title}
							</th>
						)
					})
				}
			</tr>
			{
				apTh.map((time, index) => {
					return (
						<tr key={index} className='flex'>
							{
								tableTh.map((item, iKey) => {
									if (iKey === 0) {
										return (
											<td className='flex tb-flex lr-flex' style={{width: item.width, minHeight: '120px'}} key={iKey}>{time.title}</td>
										)
									} else {
										return (
											<td className='' style={{width: item.width, minHeight: '120px'}} key={iKey}>
												{
													fastSchedules[item.value + time.value] && fastSchedules[item.value + time.value].map((item, itemkey) => {
														console.log('====fastSchedules[item.value + time.value]', fastSchedules[item.value + time.value])
														return (
															<span key={itemkey} style={{width: '49%', display: 'inline-block', lineHeight: '26px'}}>{item.doctorName}</span>
														)
													})
												}
											</td>
										)
									}
								})
							}
						</tr>
					)
				})
			}
			<style jsx>{`
				table{
					border-bottom: 1px solid ${theme.bordercolor};
					border-right: 1px solid ${theme.bordercolor}; 
				}
				td, th{
					color: ${theme.mainfontcolor};
					border-top: 1px solid ${theme.bordercolor};
					border-left: 1px solid ${theme.bordercolor}; 
					font-size: 12px;
					position: relative;
					font-weight: 300;
					
				}
				th{
					text-align: center;}
				td:not(:first-child){
					padding:  10px;
				}
				th:not(:first-child) {
					padding: 0 10px;
				}
			`}</style>
		</table>
	)
}



function mapStateToProps (state) {
  return {
    loading: state.schedule.loading,
		error: state.schedule.error,
		fastSchedules: state.schedule.data.fastSchedules,
  }
}

export default connect(mapStateToProps, { queryDoctorSchedules, showPrompt })(ManageAllScheduleScreen)
