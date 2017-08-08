import React, { Component, PropTypes } from 'react';
import {theme} from 'components';

/**
 * 
 * @param {*page\clickPage\data} props 
 */
export default function PageCard(props) {
  return (
    <div>
			<footer className={'fenye flex tb-flex lr-flex'}>
				{/* <article className="left">共 {pageInfo.count|| '0'} 条</article> */}
				{/* <span>首页</span> */}
				<span className='fenyeItem' style={{color: props.page === 1 ? theme.nfontcolor : theme.fontcolor}}
					onClick={() => {
						if (props.page === 1) return
						props.clickPage('prev')
					}}>上一页</span>
				{/* <span className={'fenyeItem otherPage'}>1</span> */}
				<span className={'fenyeItem curPageCss'}>{props.page}</span>
				<span className='fenyeItem' style={{color: props.data.length < 10 ? theme.nfontcolor : theme.fontcolor}}
					onClick={() => {
						console.log('----props.data.length', props.data.length)
						if (props.data.length < 10) return
						props.clickPage('next')
					}}>下一页</span>
				<article>
					跳转至<input type="number"
						onKeyUp = {(e) => {
							if (e.keyCode === 13) {
								console.log('-------keyup ---enter---')
								props.clickPage(e.target.value)
							}
						}} />页
				</article>
			</footer>
			<style jsx>{`
				.fenye{
					margin-top: 10px;
					padding: 10px;
					line-height: 26px;
					position: relative;
					text-align: center;
					font-size: 12px;
				}
				.fenye article{
					padding-left: .2rem;
				}
				.fenye article input[type=number]{
					width: .3rem;
					margin: 0 ${theme.midmargin};
				}
				.fenyeItem{
					background: #F2F2F2;
					border-radius: 2px;
					padding: 0 18px;
					display: inline-block;
					margin: 0 6px;
					cursor: pointer;
					border: 1px solid #f2f2f2;
				}
				.fenyeItem.curPageCss{
					background: #3464CA;
					color: #fff;
					border: 1px solid #3464CA;
				}
				.otherPage{
					border: 1px solid #f2f2f2;
					background: #fff;
				}
			`}</style>
    </div>
  );
}
