import React, { Component } from 'react'
import Router from 'next/router'
import {theme, Modal, ModalHeader, ModalFooter} from 'components'
import Link from 'next/link'

export default class OrderTipModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
	}

  render () {
    return (
			<Modal showModalState={this.props.showModalState} style={{top: '20%'}} sectionStyle={{width: '30%'}}>
				<ModalHeader>提示</ModalHeader>
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
						onClick={() => {this.props.clickModalOk()}}>确定</button>
					</ModalFooter>
			</Modal>
    )
  }
}

