import React, { Component } from 'react'
import {theme} from 'components'
import {ORDERINFO} from 'config'

export default class OrderListTitle extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    return (
			<ul className={'orderRecordTitle'}>
				{
					ORDERINFO.order_list_title.map((item, iKey) => {
						return (
							<li className={'left'} key={iKey} style={item.style}>{item.title}</li>
						)
					})
				}
				<p className='clearfix'></p>
				<style jsx>{`
					.orderRecordTitle{
						color: #797979;
						background: #F2F2F2;
						padding: 10px 15px;
						font-size: 12px;
						border-radius: 3px;
					}
				`}</style>
			</ul>
    )
  }
}