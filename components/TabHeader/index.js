import React, { Component, PropTypes } from 'react';
import theme from '../theme.js';

/**
 * component: TabHeader
 * @param {*clickShowModal} 
 */
export default function TabHeader(props) {
	const curPayStatue = props.curPayStatue;
	const types = props.types || [];
	return (
		<ul className='tabheader flex'>
			{
				types && types.map((type, iKey) => {
					return (
						<li key={iKey} className={curPayStatue === type.value ? 'tabheaderCur' : ''}
						onClick={() => {props.clickTab(type.value)}}>{type.text}</li>
					)
				})
			}
			<style jsx>{`
				.tabheader{
					background: #fff;
				}
				.tabheader li{
					line-height: .45rem;
					color: ${theme.fontcolor};
					font-size: ${theme.fontsize};
					border-bottom: 2px solid #fff;
					width: 50%;
					text-align: center;
				}
				.tabheader li.tabheaderCur{
					color: ${theme.maincolor};
					border-bottom: 2px solid ${theme.maincolor};
				}
			`}</style>
		</ul>
	)
}