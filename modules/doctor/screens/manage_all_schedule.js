import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, PageCard} from 'components'
import {ORDERINFO, DOCTORINFO, HOSPITALINFO} from 'config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryDoctors, showPrompt } from '../../../ducks'
import { connect } from 'react-redux'
import {ManageListItem, ManageDoctorModal} from '../components'


class ManageAllScheduleScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    // this.queryDoctors()
  }

	async queryDoctors() {
		let error = await this.props.queryDoctors(this.props.client, {limit: 10, skip: (this.state.page - 1) * 10})
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
			this.props.showPrompt(this.props.error)
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
        {/* <PageCard data={this.props.doctors} page={this.state.page}
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
              this.queryDoctors()
            })
          }} /> */}
      </div>
    )
  }
}

const tableView = (self) => {
	const tableTh = [
		{title: '', width: '20px', height: '94px'},
		{title: '一', width: '14%'},
		{title: '二', width: '14%'},
		{title: '三', width: '14%'},
		{title: '四', width: '14%'},
		{title: '五', width: '14%'},
		{title: '六', width: '14%'},
		{title: '日', width: '14%'}
	]
	return (
		<table className='left' style={{cellPadding: 0, borderSpacing: 0, marginTop: theme.lrmargin}}>
			<tr className='flex'>
				{
					tableTh.map((item, iKey) => {
						return (
							<th className='flex tb-flex lr-flex' style={{background: '#E8EEFA', lineHeight: '30px', width: item.width}} key={iKey}>
								{item.title}<i style={{height: '31px'}}></i>
							</th>
						)
					})
				}
			</tr>
			{
				['上', '下', '晚'].map((time, index) => {
					return (
						<tr key={index} className='flex'>
							{
								tableTh.map((item, iKey) => {
									if (iKey === 0) {
										return (
											<td className='flex tb-flex lr-flex' style={{width: item.width, minHeight: '120px'}} key={iKey}>{time}<i></i></td>
										)
									} else {
										return (
											<td className='' style={{width: item.width, minHeight: '120px'}} key={iKey}>
												<span style={{width: '49%', display: 'inline-block'}}>陈米粒</span><span style={{width: '49%', display: 'inline-block'}}>陈米粒</span><span style={{width: '49%', display: 'inline-block'}}>陈米粒</span>
												<i></i>
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
				td i, th i{
					position: absolute;
					height: 100%;
					width: 100%;
					top: -1px;
					left: -1px;
					border: 1px solid ${theme.maincolor};
					display: none;
				}
				td:first-child i{width: 21px;}
				td:not(:first-child) {cursor: pointer;}
				td:not(:first-child):hover i{
					{/* border: 1px solid ${theme.maincolor}
					width: 100%;
					height: 100%;
					z-index: 100; */}
					display: block;
				}
			`}</style>
		</table>
	)
}



function mapStateToProps (state) {
  return {
    doctors: state.doctor.data,
    loading: state.doctor.loading,
    error: state.doctor.error
  }
}

export default connect(mapStateToProps, { queryDoctors, showPrompt })(ManageAllScheduleScreen)
