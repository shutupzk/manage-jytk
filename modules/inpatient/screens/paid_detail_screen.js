import React, { Component } from 'react'

class PaidDetailScreen extends Component {
  render () {
    const list = [
      {key: '凭证单号', value: '383221231233123'},
      {key: '缴费时间', value: '8月15日 12:00'},
      {key: '支付方式', value: '支付宝'},
      {key: '住院号', value: '1009660'},
      {key: '患者姓名', value: '张三'},
      {key: '充值金额', value: '¥0.02'}
    ]
    return (
      <div>
        <div>
          {
            list.map((item, i) => (
              <div
                style={{backgroundColor: '#ffffff', marginBottom: 1, padding: 10}}
                key={i}
                onPress={() => {}}
              >
                <div>{title(item, i)}</div>
              </div>
            ))
         }
        </div>
      </div>
    )
  }
}

const title = (item) => {
  return (
    <div style={{display: 'flex', padding: '0px 5px'}}>
      <div style={{color: '#797979', fontSize: 15}}>{item.key}</div>
      <div style={{flex: 1, alignItems: 'flex-end'}}>
        <div style={{color: '#505050', fontSize: 15, float: 'right'}}>{item.value}</div>
      </div>
    </div>
  )
}

export default PaidDetailScreen
