import React, { Component } from 'react'
import { connect } from 'react-redux'
// import swal from 'sweetalert2'

import { updatePatient } from '../../../ducks'

/**
 * 医保卡信息
 */
class CarteVitalScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  // 提交
  async submit () {
    // todo

    // swal({text: '解除绑定成功'})
    this.props.url.back()
  }

  getSelfPatient (patients) {
    for (let id in patients) {
      if (patients[id].relationship === '01') {
        return patients[id]
      }
    }
  }

  render () {
    if (this.props.error) {
      return (
        <div>error...</div>
      )
    }
    if (this.props.loading) {
      return (
        <div>loading...</div>
      )
    }
    const patient = this.getSelfPatient(this.props.patients)
    return (<div style={{margin: '20px 0px'}}>
      <div>
        <div style={{backgroundColor: '#ffffff', padding: '10px 20px', marginBottom: 1, display: 'flex'}}>
          <div style={{flex: 2}}>卡号</div>
          <div style={{flex: 10}}>{patient.carteVital}</div>
        </div>
        <div style={{backgroundColor: '#ffffff', padding: '10px 20px', marginBottom: 1, display: 'flex'}}>
          <div style={{flex: 2}}>状态</div>
          <div style={{flex: 10}}>{'有效'}</div>
        </div>
      </div>
      <div style={{marginTop: 20, padding: 20}}>
        <button onClick={() => this.submit()} style={{backgroundColor: '#3CA0FF', display: 'block', width: '100%', borderRadius: '10px', height: 40}}>解除绑定</button>
      </div>
    </div>)
  }
}

function mapStateToProps (state) {
  return {
    patients: state.patients.data,
    loading: state.patients.loading,
    error: state.patients.error
  }
}

export default connect(mapStateToProps, { updatePatient })(CarteVitalScreen)
