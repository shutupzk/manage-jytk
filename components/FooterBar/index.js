import React, { Component, PropTypes } from 'react';
import {HOSPITAL_NAME, HOSPITALINFO} from 'config'
import {theme} from 'components'

export default class FooterBar extends Component {


	render() {
  	const notLoginPage = this.props.notLoginPage || false;
  	return (
			<footer
				className={notLoginPage ? 'footerBar' : 'footerBar footerBar2'}
				style={{background: HOSPITALINFO.footerbar_background_color}}>
				{HOSPITAL_NAME}
				<span style={{padding: '0 .06rem'}}>{HOSPITALINFO.contact[1].title}:{HOSPITALINFO.contact[1].values}</span>
				{HOSPITALINFO.contact[2].title}
				<style jsx>
					{`
						.footerBar{
							line-height: 40px;
							text-align: center;
							color: #fff;
							position: relative;
							width: 100%;
							z-index: 10;
						}
						.footerBar2{
							opacity: 0.6;
							position: fixed;
							bottom: 0;
						}
					`}
				</style>
			</footer>
		);
	}
}
