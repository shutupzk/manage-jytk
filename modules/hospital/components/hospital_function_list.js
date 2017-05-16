import React, { Component } from 'react'
import { ListItem } from '../../../components'
import Link from 'next/link'

export default class HospitalFunctionList extends Component {
  renderItem () {
    let item = this.props.item
    let href = {pathname: '/hospital/' + item.navigateName, query: item.params}
    // '/hospital/' + item.navigateName + '?toScreenKey=' + item.params ? item.params.toScreenKey : ''
    return (
      <Link href={href}><div style={styles.itemDiv}>
        <div style={styles.left}>
          <img src={item.avatar} style={styles.img} />
        </div>
        <div style={styles.right}>
          <div style={{ float: 'left', width: '70%' }}>
            <h4 style={{ margin: '0px', fontSize: '14px' }}>{item.title}</h4>
            <p style={styles.rightP}>{item.subTitle}</p>
            <div style={{ clear: 'both' }}>&nbsp;</div>
          </div>

          <img src='../../../static/icons/arrow_right.png' style={styles.rightImg} />
        </div>
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
const styles = {
  itemDiv: {
    marginTop: '30px',
    width: '100%'
  },
  left: {
    marginTop: '5px',
    float: 'left',
    width: '10%',
    height: '46px',
    verticalAlign: 'middle'
  },
  right: {
    marginTop: '10px',
    width: '88%',
    height: '100%'
  },
  rightP: {
    margin: '0px',
    fontSize: '12px'
  },
  li: {
    marginLeft: 10,
    marginTop: 5,
    color: '#B4B4B4',
    fontSize: 13
  },
  img: {
    marginTop: '10px',
    height: 30,
    width: 30,
    alignSelf: 'center'
  },
  rightImg: {
    float: 'right',
    marginTop: '15px',
    height: 10,
    width: 8,
    alignSelf: 'center'
  }
}
