import React, {Component} from 'react'

export class DailyFeeListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }

  render () {
    let {data} = this.props
    return (
      <div style={{backgroundColor: '#ffffff'}}>
        <div
          onClick={() => {
            this.setState({
              open: !this.state.open
            })
          }}>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#ffffff', padding: '10px 15px'}}>
            <div style={{color: '#B4B4B4', fontSize: 16}}>{data.name}</div>
            <div style={{flex: 1}} />
            <div style={{color: '#B4B4B4', fontSize: 16}}>{data.chargeTotal}<span style={{padding: '0px 5px'}}>{!this.state.open ? '>' : <img src='/static/icons/down.png' style={{width: 10, height: 10}} />}</span></div>
          </div>
        </div>
        <div style={styles.spliteLine} />
        {contentList(this.state, data.inpatientBillItems)}
      </div>
    )
  }
}

const contentList = (state, data) => {
  // const data = [
  //   {data: '银黄胶囊'},
  //   {data: '阿莫西林'}]
  let open = state.open
  if (open) {
    return (
      <div>
        {
        data.map((item, i) => (
          <div
            tyle={{backgroundColor: '#FBFBFB'}}
            key={i}
          >
            <img />
            <div>{contentListItem(item)}</div>
          </div>
      ))
    }
      </div>
    )
  } else {
    return null
  }
}

const contentListItem = (data) => {
  return (
    <div style={{padding: '0px 15px'}}>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <div style={{color: '#505050', fontSize: 15}}>{data.name}</div>
        <div style={{borderColor: '#F2F2F2', borderRadius: 50, borderWidth: 0.5, backgroundColor: '#F2F2F2', marginLeft: 10, padding: 3, justifyContent: 'center'}}>
          <div style={{color: '#B4B4B4', fontSize: 11}}>甲类</div>
        </div>
      </div>
      <div style={{flexDirection: 'row', marginTop: 13, display: 'flex', paddingRight: 15, paddingLeft: 15}}>
        <div style={{flex: 3, color: '#797979', fontSize: 13}}>{'¥' + data.price + '/' + data.unit}</div>
        <div style={{flex: 6, justifyContent: 'center', flexDirection: 'row'}}>
          <div style={{color: '#797979', fontSize: 13, textAlign: 'center'}}>{'x' + data.amout}</div>
        </div>
        <div style={{flex: 3, justifyContent: 'center', flexDirection: 'row'}}>
          <div style={{color: '#797979', fontSize: 13, textAlign: 'right'}}>{'¥' + data.total}</div>
        </div>
      </div>
      <div style={styles.spliteLine} />
    </div>
  )
}

const styles = {
  spliteLine: {
    backgroundColor: '#E6E6E6',
    // width: '100%',
    height: 1.5
  }
}
