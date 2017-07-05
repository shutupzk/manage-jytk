import React, { Component, PropTypes } from 'react';
import {theme} from 'components';

export default function NoDataCard(props) {
  const {tip} = props;
  return (
		<div style={{textAlign: 'center'}}>
			<img style={{width: 85, paddingTop: '40%'}} src={'/static/icons/noDataIcon.png'} />
			<p style={{color: '#CBCFD3', fontSize: 16, lineHeight: '40px'}}>{tip}</p>
		</div>
  );
}
