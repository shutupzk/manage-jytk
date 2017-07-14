import React, { Component } from 'react'
import {theme, RequireLoginCard} from 'components'
import { connect } from 'react-redux'
import { signin } from '../../../ducks'

// import { isEmptyObject } from '../../../utils'
// import Router from 'next/router'
class RealTimeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      payStatus: false,
      selectedId: ''
    }
  }

  componentWillMount () {
    this.autoSignin()
  }

  // 自动登陆 刷新token,用户信息,就诊人信息，
  async autoSignin () {
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId
    if (userId) {
    }
  }

  render () {
    if (!this.props.token) {
      return (
        <div>
          <span><RequireLoginCard /></span>
        </div>
      )
    }
    return (
      <div className='waitPage'>
        <header>内分泌科&nbsp;|&nbsp;黄乔东</header>
				{/*<section style={{textAlign: 'center', padding: 30, color: theme.fontcolor}}>
					<svg width="50px" height="50px" viewBox="314 345 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
						<g id="Group" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(314.000000, 345.000000)">
							<circle id="Oval" fill="#D8D8D8" cx="50" cy="50" r="50"></circle>
							<text id="！" fontFamily=".PingFangSC-Regular, .PingFang SC" fontSize="60" fontWeight="normal" fill="#FFFFFF">
								<tspan x="36" y="70">！</tspan>
							</text>
						</g>
					</svg>
					<p style={{paddingTop: 10}}>请到分诊台分诊</p>
					<p>分诊完成后即可查看</p>
				</section>*/}
				<div>
					<section>
						<dl className='flex tb-flex'>
							<dd>当前号&nbsp;&nbsp;<strong>252</strong></dd>
							<dd>等待人数&nbsp;&nbsp;<strong>2</strong></dd>
						</dl>
						<ul>
							<li><span>诊&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室</span><span className='textleft'>第2诊室</span></li>
							<li><span>我的号码</span><span style={{fontWeight: '500'}} className='textleft'>255</span></li>
							<li><span>号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span><span className='textleft'>第2诊室</span></li>
						</ul>
					</section>
					<footer>
						<button className='btnBG btnBGMain'>刷新</button>
					</footer>
				</div>
				<style jsx>{`
					.waitPage{
						color: ${theme.mainfontcolor}
					}
					.waitPage header{
						line-height: 40px;
						border-bottom: 1px solid ${theme.bordercolor};
						padding-left: ${theme.lrmargin};
						background: #fff;
						margin-bottom: 10px;
					}
					section{
						margin: 0 10px;
						background: #fff;
						border-radius: 3px;
						border: 1px solid ${theme.bordercolor};
					}
					dl{
						line-height: 50px;
						padding: 0 15px;
						justify-content: space-between;
						border-bottom: 1px solid ${theme.bordercolor}; 
					}
					strong{
						font-size: 26px;
						color: ${theme.maincolor};
					}
					ul{
						padding: 15px 0;
					}
					li{
						padding: 6px 15px;
						color: ${theme.fontcolor};
					}
					.textleft{
						color: ${theme.mainfontcolor};
						margin-left: 15px;
					}
					footer{
						padding: 30px 20px;
					}
				`}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    token: state.user.data.token
  }
}

export default connect(
  mapStateToProps, {
    signin
  }
)(RealTimeScreen)
