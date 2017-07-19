import React, { Component } from 'react'
import {theme} from 'components'
import {ORDERTYPE} from 'config'

export default class OrderTab extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    return (
			<ul className={'orderNav'}>
				{
					ORDERTYPE.map((item, iKey) => {
						return (
							<li key={iKey}
								className={this.props.status === item.value ? 'curLi left' : 'left'}
								onClick={() => {this.props.changeStatus(item.value)}}>{item.title}</li>
						)
					})
				}
				<li className={this.props.status === '' ? 'curLi left' : 'left'}
					onClick={() => {this.props.changeStatus('')}}>全部订单</li>
				<div className='clearfix'></div>
				<style jsx>{`
					.orderNav{
						// padding-right: 20px;
						border-bottom: 1px solid ${theme.bordercolor};
						display: inline-block;
						margin: ${theme.tbmargin} ${theme.lrmargin} 0;
					}
					li{
						font-size: ${theme.nfontsize};
						margin-right: .4rem;
						color: ${theme.mainfontcolor};
						line-height: .26rem;
						cursor: pointer;
					}
					li:last-child{
						margin-right: 0;
					}
					li.curLi{
						border-bottom: 3px solid ${theme.maincolor};
						color: ${theme.maincolor};
						font-size: .14rem;
						font-weight: 500;
					}
				`}</style>
			</ul>
    )
  }
}