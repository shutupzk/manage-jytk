import React, { Component, PropTypes } from 'react';
import {theme} from 'components';

export default function ErrCard(props) {
  return (
		<div style={{textAlign: 'center'}}>
			<img style={{width: '40%', paddingTop: '40%'}} src={'/static/icons/errIcon.png'} />
			<p style={{color: '#CBCFD3', fontSize: 16, lineHeight: '40px'}}>
				{props.content || '有报错，请稍后重试'}
			</p>
		</div>
  );
}
