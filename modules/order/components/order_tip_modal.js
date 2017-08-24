import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter} from 'components'
import {ORDERINFO} from 'config'
import Link from 'next/link'

export default class OrderTipModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
			reason: ''
    }
	}

  render () {
		const selectOrder = this.props.selectOrder || {}
		let curStatus = ORDERINFO.order_type.filter((item) => item.value === selectOrder.status) || []
		const reasons = [
			{title: '医生超时未提供服务', value: 1},
			{title: '订单未执行，患者申请退款', value: 2},
			{title: '订单已执行，患者不满意，要求退款', value: 3},
			{title: '医生要求退款', value: 4},
		]
		const {reason} = this.state
    return (
			<Modal showModalState={this.props.showModalState} style={{top: '20%', borderRadius: 3, fontSize: 13, color: theme.mainfontcolor}} sectionStyle={{width: '34%'}}>
				<ModalHeader style={{background: '#E8EEFA', fontWeight: 500, padding: theme.tbmargin, fontSize: 16}}>请确认</ModalHeader>
				<div style={{padding: '.1rem .15rem', color: theme.fontcolor}}>
					<article><span>医生：</span>{selectOrder.doctor && selectOrder.doctor.doctorName}</article>
					<article><span>患者：</span>{selectOrder.patient && selectOrder.patient.user && selectOrder.patient.user.name}</article>
					<article><span>服务类型：</span>{selectOrder.consultationReason && selectOrder.consultationReason.reason}&nbsp;&nbsp;</article>
					<article><span>订单状态：</span><span style={{color: '#F8A644'}}>{curStatus && curStatus[0] && curStatus[0].title}</span></article>
					<ul>
						<li style={{paddingTop: theme.lrmargin}}>*请选择退款原因</li>
						{
							reasons && reasons.map((reasonItem, iKey) => {
								return (
									<li className='flex tb-flex' key={iKey} onClick={() => {
										this.setState({reason: reasonItem.title})
									}
										}>
										<p className='checkbox' style={{paddingRight: theme.midmargin}}>
											{
												reason === reasonItem.title ?
													<input type="checkbox" checked id={`reason${iKey}`} />
											:
													<input type="checkbox" checked={false} id={`reason${iKey}`} />
											}
											<label style={{background: '#fff', border: `1px solid ${theme.bordercolor}`}} htmlFor={`reason${iKey}`}></label>
										</p>
										{reasonItem.title}
									</li>
								)
							})
						}
					</ul>
					<footer style={{margin: `${theme.midmargin} ${theme.lrmargin} 0`}}><textarea ref='remarkRef' placeholder='备注信息'></textarea></footer>
				</div>
				{this.props.children}
				<ModalFooter>
					<article style={{width: '50%'}}>
						<button className='btnBorder'
							style={{display: 'inline-block', width: '100%', borderRadius: '2px 0 0 2px', lineHeight: '36px', border: 'none', fontSize: theme.mainfontsize,
								borderRight: `1px solid ${theme.bordercolor}`}}
							onClick={() => this.props.onHide()}>取消</button>
					</article>
					<button className='btnBorder'
						style={{display: 'inline-block', lineHeight: '36px', border: 'none', width: '50%', fontSize: theme.mainfontsize, color: theme.maincolor}}
						onClick={() => {this.props.clickModalOk(this.state.reason, this.refs.remarkRef && this.refs.remarkRef.value)}}>确定</button>
				</ModalFooter>
				<style jsx>{`
					article{
						line-height: 22px;
						color: ${theme.mainfontcolor};
						font-size: ${theme.nfontsize};
					}
					li:first-child{
						color: ${theme.mainfontcolor};
						font-size: 14px;
						font-weight: 500;
					}
					li:not(:first-child) {
						padding: .06rem .15rem;
						color: ${theme.mainfontcolor};
						cursor:default
					}
					textarea{
						border: 1px solid ${theme.nbordercolor};
						background: #FBFBFB;
						min-height: .8rem;
						padding: ${theme.midmargin};
						width: 100%;
					}
				`}</style>
			</Modal>
    )
  }
}

