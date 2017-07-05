import React, { Component } from 'react'
// import { connect } from 'react-redux'
import {theme} from 'components'
/**
 * 隐私条例
 */
class PrivacyTermsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <div style={{padding: 15, backgroundColor: '#ffffff'}}>
        <div className='termTitle'>省医通用户个人信息及隐私保护政策</div>
        <div className='termDate'>2017-06-06</div>
        <div className='termContent'>
          <div> &nbsp; 本《隐私政策》与您使用的服务息息相关，请您务必仔细阅读、充分理解（未成年人应当在其监护人的陪同下阅读）。</div>
        </div>
        <style jsx>{`
          .termTitle {
            text-align: center;
            font-size: 18px;
            color: ${theme.mainfontcolor};
            font-weight: 500;
            line-height: 40px;
          }
          .termDate {
            text-align: center;
            font-size: ${theme.nfontsize};
            color: ${theme.nfontcolor};
          }
          .termContent {
            margin-top: 20px;
            font-size: 14px;
            line-height: 24px;
          }
        `}</style>
      </div>
    )
  }
}

export default PrivacyTermsScreen
