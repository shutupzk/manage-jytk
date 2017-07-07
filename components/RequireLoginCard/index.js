import React, { Component, PropTypes } from 'react';
import {theme} from 'components';
import Link from 'next/link'

export default function RequireLoginCard(props) {
  return (
		<div style={{textAlign: 'center'}}>
			<img style={{width: 85, paddingTop: '40%'}} src={'/static/icons/noDataIcon.png'} />
			<Link href='/signin'><p style={{color: theme.nfontcolor, fontSize: 16, lineHeight: '40px'}}>去登录</p></Link>
		</div>
  );
}
