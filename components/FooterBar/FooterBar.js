import React, { Component, PropTypes } from 'react';


export default class FooterBar extends Component {
	static propTypes = {
  notLoginPage: PropTypes.bool
	};


	render() {
  const styles = require('./FooterBar.scss');
  const notLoginPage = this.props.notLoginPage || false;
  return (
			<footer className={notLoginPage ? styles.footerBar2 + ' ' + styles.footerBar : styles.footerBar}>北大医疗互联网医院          联系电话：010-69006900  京ICP备14005009号</footer>
		);
	}
}
