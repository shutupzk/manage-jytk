import React, { Component, PropTypes } from 'react';
import {theme} from 'components';
import Link from 'next/link'

export function ResultSuccessCard(props) {
	const title = props.title || '支付成功'
  return (
		<div style={{textAlign: 'center'}}>
			<div style={{background: '#fff', borderRadius: 3, border: '1px solid #fff', borderColor: theme.bordercolor, margin: '10px'}}>
				<header className='flex tb-flex lr-flex' style={{padding: '40px 0 30px'}}>
					<img style={{width: 24}} src={'/static/icons/success.png'} />
					<p style={{fontSize: 20, color: theme.mainfontcolor, paddingLeft: 10}}>{title}</p>
				</header>
				{props.children}
				<style jsx global>{`
					ul{
						padding: 10px 0 20px 34px !important;
						line-height: 26px;
						color: ${theme.mainfontcolor};
						text-align: left;
					}
				`}</style>
			</div>
			<p style={{margin: '30px 15px'}}><button className='btnBG btnBGMain' onClick={() => {props.clickResultSuccess()}}>完成</button></p>
		</div>
  );
}

export function ResultFailCard(props) {
	const title = props.title || '支付失败'
  return (
		<div style={{textAlign: 'center'}}>
			<div style={{background: '#fff', borderRadius: 3, border: '1px solid #fff', borderColor: theme.bordercolor, margin: '10px'}}>
				<header className='flex tb-flex lr-flex' style={{padding: '40px 0 30px'}}>
					<img style={{width: 24}} src={'/static/icons/fail.png'} />
					<p style={{fontSize: 20, color: theme.mainfontcolor, paddingLeft: 10}}>{title}</p>
				</header>
				{props.children}
				<style jsx global>{`
					ul{
						padding: 10px 0 20px 34px !important;
						line-height: 26px;
						color: ${theme.mainfontcolor};
						text-align: left;
					}
				`}</style>
			</div>
			<p style={{margin: '30px 15px'}}><button className='btnBG btnBGMain' onClick={() => {props.clickResultFail()}}>完成</button></p>
		</div>
  );
}
