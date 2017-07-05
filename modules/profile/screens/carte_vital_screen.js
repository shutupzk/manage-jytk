import React, { Component } from 'react'
import { connect } from 'react-redux'
import {theme, Prompt, ErrCard, Loading} from 'components'

import { updatePatient } from '../../../ducks'

/**
 * 医保卡信息
 */
class CarteVitalScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      closeTime: 2,
      autoClose: true,
      isShow: false,
      promptContent: ''
    }
  }

  // 提交
  async cancelBind (patient) {
    // console.log('aa')
    console.log('确认删除？')
    const err = await this.props.updatePatient(this.props.client, {patientId: patient.id, carteVital: null})
    if (err) {
      this.setState({
        closeTime: 2,
        autoClose: true,
        isShow: true,
        promptContent: '解绑失败'
      })
    } else {
      this.setState({
        closeTime: 2,
        autoClose: true,
        isShow: true,
        promptContent: '解绑成功'
      })
    }
  }

  getSelfPatient (patients) {
    for (let id in patients) {
      if (patients[id].relationship === '01') {
        return patients[id]
      }
    }
  }

  getPatientArr (patients) {
    let patArr = []
    for (let id in patients) {
      if (patients[id].carteVital) {
        patArr.push(patients[id])
      }
    }
    return patArr
  }

  render () {
    // if (this.props.error) {
    //   return (
    //      <div><ErrCard /></div>
    //   )
    // }
    if (this.props.loading) {
      return (
        <div><Loading showLoading={true} /></div>
      )
    }
    // const patient = this.getSelfPatient(this.props.patients)
    const patients = this.getPatientArr(this.props.patients)
    return (<div style={{margin: '20px 0px'}}>
      {
        patients.map((patient) => {
          return (<div style={{marginBottom: 20}} key={patient.id}>
            <div className='list'>
              <div className='item flex tb-flex'>
                <span className='textLeft'>姓名</span>
                <span className='textRight'>{patient.name}</span>
              </div>
              <div className='item flex tb-flex'>
                <span className='textLeft'>卡号</span>
                <span className='textRight'>{patient.carteVital}</span>
              </div>
              <div className='item flex tb-flex'>
                <span className='textLeft'>状态</span>
                <span className='textRight'>{'有效'}</span>
              </div>
            </div>
            <div>
              <button className='btnBG' style={{backgroundColor: '#fff', color: `${theme.maincolor}`, borderRadius: 0}} onClick={() => {
                console.log(patient.id)
                this.cancelBind(patient)
              }}>解除绑定</button>
            </div>
          </div>)
        })
      }
      <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
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
