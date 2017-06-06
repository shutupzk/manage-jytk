import React, { Component } from 'react'
import { connect } from 'react-redux'

class InfoEntryScreen extends Component {
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
      if (inpatientRecords[i] && inpatientRecords[i].id) {
        inpatientRecordArray.push(inpatientRecords[i])
      }
    }
    var height = window.innerHeight - 50
    return (
      <div>
        <div style={{height: height, overflow: 'auto'}}>
          {
            topInfo(this.filterRecord(inpatientRecordArray, selectInpatientId), this.props)
          }
          {
            bottomSetInfo(this.filterRecord(inpatientRecordArray, selectInpatientId), this.props)
          }
        </div>
        <div style={{margin: '10px'}}>
          <button style={{width: '100%', backgroundColor: '#3CA0FF', display: 'block', borderRadius: 10, padding: 10, textAlign: 'center'}}>提交</button>
        </div>
      </div>
    )
  }
}

const topInfo = (inpatientRecord, props) => {
  const patient = props.patientsData[inpatientRecord.patientId]
  return (
    <div>
      <div style={{ padding: 10, marginBottom: 1, backgroundColor: '#ffffff', fontSize: 15 }}>{ inpatientRecord.name }</div>
      <div style={{ padding: 10, backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', padding: '2px 0px' }}>
          <div style={{flex: '2'}}>性 &nbsp;别</div>
          <div style={{flex: '10'}}>{patient.sex === '1' ? '男' : '女'}</div>
        </div>
        <div style={{ display: 'flex', padding: '2px 0px' }}>
          <div style={{flex: '2'}}>出生日期</div>
          <div style={{flex: '10'}}>{patient.birthday}</div>
        </div>
        <div style={{ display: 'flex', padding: '2px 0px' }}>
          <div style={{flex: '2'}}>联系电话</div>
          <div style={{flex: '10'}}>{patient.phone}</div>
        </div>
        <div style={{ display: 'flex', padding: '2px 0px' }}>
          <div style={{flex: '2'}}>身份证号</div>
          <div style={{flex: '10'}}>{patient.certificateNo}</div>
        </div>
      </div>
    </div>
  )
}

const bottomSetInfo = () => {
  var dataArr = [
    {key: '国籍', value: '中国', isEdit: true},
    {key: '名族', value: '汉', isEdit: true},
    {key: '婚姻情况', value: '未婚', isEdit: true},
    {key: '出生地区', value: '北京海淀', isEdit: true},
    {key: '职业', value: '高级设计师', isEdit: true},
    {key: '现住地区', value: '北京市海淀区', isEdit: true},
    {key: '现住详细地址', value: '北京市海淀区中关村西路48号幸福家园5号楼1603', isEdit: true},
    {key: '户口地区', value: '北京市海淀区'},
    {key: '户口详细地址', value: '北京市海淀区'},
    {key: '工作单位', value: '方正国际'},
    {key: '工作单位地址', value: '中关村方正大厦'},
    {key: '工作单位电话', value: '0109832125'},
    {key: '联系人', value: '赵晓'},
    {key: '与联系人关系', value: '朋友', isEdit: true},
    {key: '联系人电话', value: '15890873246'},
    {key: '联系人地址', value: '北京市海淀区中关村西路48号幸福家园'}
  ]
  return (
    <div style={{marginTop: '10px'}}>
      {dataArr.map((item, i) => {
        return (
          <div key={i} style={{display: 'flex', backgroundColor: '#ffffff', marginBottom: 1, padding: 10}}>
            <div style={{flex: 1}}>{item.key}</div>
            <div>{item.value} {item.isEdit ? '>' : ''}</div>
          </div>
        )
      })}
    </div>
  )
}

function mapStateToProps (state) {
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

export default connect(mapStateToProps)(InfoEntryScreen)
