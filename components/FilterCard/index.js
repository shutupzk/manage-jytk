import React, { Component } from 'react'
import {theme} from 'components'

export class FilterCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    return (
			<div style={{fontSize: theme.fontsize, marginBottom: theme.tbmargin}}>
				{this.props.children}
				<div className='clearfix'></div>
				<style jsx>{`
					select, section, article, input, a, button{
							height: .34rem;
							line-height: .34rem;
					}
				`}</style>
			</div>
    )
  }
}

/**
 * params: [changeStatus, this.state.status, config{selectTitle, valueKey, titleKey}]
 */
export class SelectFilterCard extends Component {
  render() {
		const {status, config} = this.props;
    return (
      <div className='left select flex tb-flex' style={{border: '1px solid #E6E6E6', minWidth: 130,background: 'none', borderRadius: 4, width: 'auto'}}>
        <select onChange={(e) => {this.props.changeStatus(e.target.value)}} value={status}>
          <option value=''>{config.selectTitle || '全部订单类型'}</option>
          {
            this.props.data && this.props.data.map((item, iKey) => {
              return (
                <option value={item[config.valueKey]} key={iKey}>{item[config.titleKey]}</option>
              )
            })
          }
        </select>
        <article className='select-icon'><i></i><i></i></article>
      </div>
    )
  }
}

/**
 * params: clickfilter, config{palceholder}
 */
export class KeywordCard extends Component {
	render() {
		const {config} = this.props;
		return (
			<section className='left' style={{border: '1px solid #E6E6E6', borderRadius: 4, margin: '0 .15rem'}}>
				<input type='text' className='left' style={{lineHeight: '.34rem', border: 'none', background: 'none', padding: '0 6px', minWidth: 200}}
					placeholder={config.placeholder || '订单编号/姓名/手机号'}
					ref='keywordRef' />
				<button className='left btnBGGray btnBGLitt' style={{height: '.34rem', lineHeight: '.34rem'}}
					onClick={() => this.props.clickfilter(this.refs.keywordRef && this.refs.keywordRef.value)}>搜索</button>
				<div className='clearfix' />
			</section>
		)
	}
}

export class SeniorSoso extends Component {
	render() {
		return (
			<article className='left' style={{ color: theme.mainfontcolor, display: 'none'}}>
				<span className='left'>高级搜索</span>
				<svg className='left' style={{width: 10, margin: '.12rem 0 0 .04rem'}} viewBox='1163 144 16 13' version='1.1' xmlns='http://www.w3.org/2000/svg'>
					<desc>高级搜索icon</desc>
					<defs></defs>
					<path d='M1170.99997,156.807299 L1163,150.279952 L1163.69351,149.582205 L1170.99997,155.496333 L1178.30646,149.582205 L1179,150.279952 L1170.99997,156.807299 L1170.99997,156.807299 Z M1170.99997,151.806874 L1163,145.280542 L1163.69351,144.583809 L1170.99997,150.496922 L1178.30646,144.583809 L1179,145.281571 L1170.99997,151.806874 L1170.99997,151.806874 Z' id='展开-(2)' stroke='none' fill='#797979' fillRule='evenodd'></path>
				</svg>
				<p className='clearfix'></p>
			</article>
		)
	}
}

export class LinkQuestion extends Component {
	render() {
		return (
			<a style={{color: theme.fontcolor, fontSize: theme.nfontsize, display: 'none'}} className='right'>问题和帮助QA</a>
		)
	}
}
