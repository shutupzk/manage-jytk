import React, { Component } from 'react'
import { theme } from 'components'
import { ORDERINFO } from 'config'

export default class ListTitle extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <ul className={'orderRecordTitle flex tb-flex'} style={this.props.style}>
        {this.props.data.map((item, iKey) => {
          if (item.nolistShow) {

          } else {
            return (
              <li className={'left'} key={iKey} style={item.style}>
                {item.title.indexOf('设置') > -1 || item.nolistShow ? '' : item.title}
                {item.title.indexOf('快速问诊') > -1 || item.title.indexOf('图文问诊') > -1 || item.title.indexOf('视频问诊') > -1 ? <article>(元/次)</article> : ''}
              </li>
            )
          }
        })}
        <p className='clearfix' />
        <style jsx>{`
          .orderRecordTitle {
            color: #797979;
            background: #f2f2f2;
            padding: 10px 15px;
            font-size: 12px;
            border-radius: 3px;
          }
        `}</style>
      </ul>
    )
  }
}
