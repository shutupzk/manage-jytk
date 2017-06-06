import React, { Component } from 'react'

class DoctorAdviceScreen extends Component {
  render () {
    return (
      <div>
        <div style={{backgroundColor: '#ffffff', padding: 10, marginBottom: 10}}>
          <div style={{display: 'flex', backgroundColor: '#ffffff', padding: '5px 0px', borderBottom: 'solid 0.5px #eeeeee'}}><div style={{margin: '0px 5px', width: 3, height: 15, backgroundColor: '#3CA0FF'}} />出院医嘱</div>
          <div style={{backgroundColor: '#ffffff', padding: '5px'}}>
            <div>1.注意休息</div>
            <div>2.请您按照处方按时服药</div>
            <div>3.定期到医院复查</div>
          </div>
        </div>
        <div style={{backgroundColor: '#ffffff', padding: 10, marginBottom: 10}}>
          <div style={{display: 'flex', backgroundColor: '#ffffff', padding: '5px 0px', borderBottom: 'solid 0.5px #eeeeee'}}><div style={{margin: '0px 5px', width: 3, height: 15, backgroundColor: '#3CA0FF'}} />领药窗口</div>
          <div style={{backgroundColor: '#ffffff', padding: '5px'}}>
            <div>请您到2号窗口领药</div>
          </div>
        </div>
      </div>
    )
  }
}


export default DoctorAdviceScreen
