import React, { Component } from 'react'
import { connect } from 'react-redux'
import {theme} from 'components'

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
      <div className='list'>
        <div className='item flex tb-flex'>
          <span className='textLeft'>卡号</span>
          <span className='textRight'>{patient.carteVital}</span>
        </div>
        <div className='item flex tb-flex'>
          <span className='textLeft'>状态</span>
          <span className='textRight'>{'有效'}</span>
        </div>
      </div>
      <div style={{marginTop: 20, padding: 20}}>
        <button className='btnBG btnBGMain' onClick={() => this.submit()}>解除绑定</button>
      </div>
      <style jsx>{`
        .item {
          padding: 10px 20px;
          {/*height: 31px;*/}
          {/*flexWrap: nowrap;*/}
          align-items: center;
          flexDirection: row;
          background-color: #ffffff;
          justifyContent: space-between;
          margin-bottom: 1px;
        }
        .textLeft {
          {/*font-size: ;*/}
          color: ${theme.fontcolor};
          font-size: ${theme.fontsize};
          padding-right: ${theme.tbmargin};
        }
        .textRight{
          font-size: ${theme.fontsize};
          color: ${theme.mainfontcolor};
        }
      `}</style>
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
