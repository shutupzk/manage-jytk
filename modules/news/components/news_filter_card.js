import React, { Component } from 'react'
import {theme} from 'components'
import {ORDERTYPE} from 'config'

export default class NewsFilterCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    return (
			<div style={{fontSize: theme.fontsize, marginBottom: theme.tbmargin}}>
        {this.props.hideSelectType ? '' : selectcard(this, this.props.status)}
				{/* {keywordcard(this)} */}
        {
          this.props.hideSeniorSoso ? '' :
          <article className='left' style={{ color: theme.mainfontcolor}}>
            <span className='left'>高级搜索</span>
            <svg className='left' style={{width: 10, margin: '.12rem 0 0 .04rem'}} viewBox='1163 144 16 13' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <desc>高级搜索icon</desc>
              <defs></defs>
              <path d='M1170.99997,156.807299 L1163,150.279952 L1163.69351,149.582205 L1170.99997,155.496333 L1178.30646,149.582205 L1179,150.279952 L1170.99997,156.807299 L1170.99997,156.807299 Z M1170.99997,151.806874 L1163,145.280542 L1163.69351,144.583809 L1170.99997,150.496922 L1178.30646,144.583809 L1179,145.281571 L1170.99997,151.806874 L1170.99997,151.806874 Z' id='展开-(2)' stroke='none' fill='#797979' fillRule='evenodd'></path>
            </svg>
            <p className='clearfix'></p>
          </article>
        }
				{/* <a style={{color: theme.fontcolor, fontSize: theme.nfontsize}} className='right'>问题和帮助QA</a> */}
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

const selectcard = (self, status) => {
  return (
		<div className='flex tb-flex'>
			<span style={{fontSize: 12, paddingRight: '.1rem'}}>请选择父级科室</span>
			<div className='select flex tb-flex' style={{border: '1px solid #E6E6E6', minWidth: 160,background: 'none', borderRadius: 4, width: 'auto'}}>
				<select onChange={(e) => {self.props.changeStatus(e.target.value)}} value={status}>
					{
						self.props.data.map((item, iKey) => {
							return (
								<option value={item.id} key={iKey}>{item.deptName}</option>
							)
						})
					}
				</select>
				<article className='select-icon'><i></i><i></i></article>
			</div>
		</div>
  )
}

const keywordcard = (self) => {
  return (
    <section className='left' style={{border: '1px solid #E6E6E6', borderRadius: 4, margin: '0 .15rem'}}>
      <input type='text' className='left' style={{lineHeight: '.34rem', border: 'none', background: 'none', padding: '0 6px', minWidth: 200}}
        placeholder={self.props.placeholder || '订单编号/姓名/手机号'}
        onChange={(e) => self.props.changeKeyword(e.target.value)} />
      <button className='left btnBGGray btnBGLitt' style={{height: '.34rem', lineHeight: '.34rem'}} onClick={() => self.props.clickfilter()}>搜索</button>
      <div className='clearfix' />
    </section>)
}
