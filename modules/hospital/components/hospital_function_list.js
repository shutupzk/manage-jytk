import React, { Component } from 'react'
import { ListItem } from '../../../components'
import Link from 'next/link'

export default class HospitalFunctionList extends Component {
  renderItem () {
    let item = this.props.item
    let href = {pathname: '/hospital/' + item.navigateName, query: item.params}
    // '/hospital/' + item.navigateName + '?toScreenKey=' + item.params ? item.params.toScreenKey : ''
    return (
      <Link href={href}><div className={'itemDiv'}>
        <div className={'left'}>
          <img src={item.avatar} className={'img'} />
        </div>
        <div className={'right'}>
          <div style={{ float: 'left', width: '70%' }}>
            <h4 style={{ margin: '0px', fontSize: '14px' }}>{item.title}</h4>
            <p className={'rightP'}>{item.subTitle}</p>
            <div style={{ clear: 'both' }}>&nbsp;</div>
          </div>

          <img src='../../../static/icons/arrow_right.png' className={'rightImg'} />
        </div>
        <style jsx>{`
          .itemDiv {
            margin-top: 30px;
            width: 100%;
          }
          .left {
            margin-top: 5px;
            float: left;
            width: 10%;
            height: 46px;
            vertical-align: middle;
          }
          .right {
            margin-top: 10px;
            width: 88%;
            height: 100%;
          }
          .rightP {
            margin: 0px;
            font-size: 12px;
          }
          .img {
            margin-top: 10px;
            height: 30px;
            width: 30px;
            align-self: center;
          }
          .rightImg {
            float: right;
            margin-top: 15px;
            height: 10px;
            width: 8px;
            align-self: center;
          }
        `}</style>
      </div></Link>
    )
  }

  render () {
    return (
      <ListItem item={this.renderItem()} />
    )
  }
}

// HospitalFunctionList.propTypes = {
//   list: PropTypes.array,
//   // navigate: PropTypes.func
// }

export { HospitalFunctionList }
