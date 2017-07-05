import React, { Component, PropTypes } from 'react';
import {theme} from 'components';
import Link from 'next/link'

export default function RequireLoginCard(props) {
  return (
		<div style={{textAlign: 'center'}}>
			<Link href='/signin'>去登录</Link>
		</div>
  );
}
