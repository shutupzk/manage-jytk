import React, { Component } from 'react'
import { connect } from 'react-redux'

class DoctorAdviceScreen extends Component {
  filterRecord (inpatientRecordArray, selectInpatientId) {
    let inpatientRecord = inpatientRecordArray.filter((inpatientRecord) => {
      if (selectInpatientId === inpatientRecord.patientId) {
        return true
      }
      return false
    })
    return inpatientRecord[0]
  }
  render () {
    const selectInpatientId = this.props.selectInpatientId
    const inpatientRecords = this.props.inpatientRecords
    let inpatientRecordArray = []
    for (let i in inpatientRecords) {
      console.log(inpatientRecords[i])
      if (inpatientRecords[i] && inpatientRecords[i].id) {
        inpatientRecordArray.push(inpatientRecords[i])
      }
    }
    const inpatientRecord = this.filterRecord(inpatientRecordArray, selectInpatientId)
    return (
      <div>
        {
          inpatientRecord.status
          ? <div>
            <div style={{backgroundColor: '#ffffff', padding: 10, marginBottom: 10}}>
              <div style={{display: 'flex', backgroundColor: '#ffffff', padding: '5px 0px', borderBottom: 'solid 0.5px #eeeeee'}}><div style={{margin: '0px 5px', width: 3, height: 15, backgroundColor: '#3CA0FF'}} />出院医嘱</div>
              <div style={{backgroundColor: '#ffffff', padding: '5px'}}>
                {inpatientRecord.disChargeOrderDesc}
                {/*<div>1.注意休息</div>
                <div>2.请您按照处方按时服药</div>
                <div>3.定期到医院复查</div>*/}
              </div>
            </div>
            <div style={{backgroundColor: '#ffffff', padding: 10, marginBottom: 10}}>
              <div style={{display: 'flex', backgroundColor: '#ffffff', padding: '5px 0px', borderBottom: 'solid 0.5px #eeeeee'}}><div style={{margin: '0px 5px', width: 3, height: 15, backgroundColor: '#3CA0FF'}} />领药窗口</div>
              <div style={{backgroundColor: '#ffffff', padding: '5px'}}>
                <div>{inpatientRecord.pharmacyWindow}</div>
              </div>
            </div>
          </div>
          : '患者还未出院'
        }
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log(state)
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    patientsData: state.patients.data,
    patientsLoading: state.patients.loading,
    inpatientLoading: state.inpatient.loading,
    selectInpatientId: state.inpatient.selectInpatientId,
    inpatientRecords: state.inpatient.data
  }
}

export default connect(
  mapStateToProps
)(DoctorAdviceScreen)
