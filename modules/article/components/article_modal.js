import React, { Component } from 'react'
import {theme, DraftCard, Modal, ModalHeader, ModalFooter} from 'components'

export default class ArticleModal extends Component {

	componentWillMount() {
	}

	componentWillReceiveProps(nextProps) {
	}

  render () {
		const {showDeleteModal} = this.props || {}
    return (
			<Modal showModalState={showDeleteModal}
					style={{top: '26%'}} sectionStyle={{width: '26%'}}>
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
							onClick={() => {
								this.props.clickModalOk()}
							}>确定</button>
				</ModalFooter>
			</Modal>
    )
  }
}
