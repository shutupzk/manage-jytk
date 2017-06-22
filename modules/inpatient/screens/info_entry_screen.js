import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateInpatientRecord } from '../../../ducks'

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
  updateInpatientRecord (id, inpatientCardId) {
    const nationalityID = this.refs.nationalityID.value
    const raceID = this.refs.raceID.value
    const marriageFlag = this.refs.marriageFlag.value
    const brithPlace = this.refs.brithPlace.value
    const professioinID = this.refs.professioinID.value
    const currentPlace = this.refs.currentPlace.value
    const newCurrentAddress = this.refs.newCurrentAddress.value
    const nativePlace = this.refs.nativePlace.value
    const newHRAddress = this.refs.newHRAddress.value
    const companyName = this.refs.companyName.value
    const companyAddress = this.refs.companyAddress.value
    const companyPhone = this.refs.companyPhone.value
    const contactPerson = this.refs.contactPerson.value
    const contactRelationshipFlag = this.refs.contactRelationshipFlag.value
    const contactPhone = this.refs.contactPhone.value
    const contactAddress = this.refs.contactAddress.value
    const param = {
      id,
      inpatientCardId,
      nationalityID,
      raceID,
      marriageFlag,
      brithPlace,
      professioinID,
      currentPlace,
      newCurrentAddress,
      nativePlace,
      newHRAddress,
      companyName,
      companyAddress,
      companyPhone,
      contactPerson,
      contactRelationshipFlag,
      contactPhone,
      contactAddress
    }
    console.log(nationalityID, raceID, marriageFlag, brithPlace, professioinID, currentPlace, newCurrentAddress, nativePlace)
    console.log(newHRAddress, companyName, companyAddress, companyPhone, contactPerson, contactRelationshipFlag, contactPhone, contactAddress)
    this.props.updateInpatientRecord(this.props.client, param)
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
        <div style={{overflow: 'auto'}}>
          {
            topInfo(inpatientRecord, this.props)
          }
          {
            bottomSetInfo(inpatientRecord, this.props)
          }
        </div>

        {1 === 1 ? <div style={{margin: '10px'}}>
          <button style={{width: '100%', backgroundColor: '#3CA0FF', display: 'block', borderRadius: 10, padding: 10, textAlign: 'center'}} onClick={() => { this.updateInpatientRecord(inpatientRecord.id, inpatientRecord.inpatientCardId) }}>提交</button>
        </div> : ''}
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

const bottomSetInfo = (inpatientRecord, props) => {
  var dataArr = [
    {key: '国籍', name: 'nationalityID', value: inpatientRecord.nationalityID || '中国', isEdit: true, options: [{id: '1', name: '中国'}, {id: '2', name: '韩国'}, {id: '3', name: '美国'}, {id: '4', name: '英国'}, {id: '5', name: '澳大利亚'}]},
    {key: '名族', name: 'raceID', value: inpatientRecord.raceID || '汉', isEdit: true, options: [{id: '1', name: '汉族'}, {id: '2', name: '满族'}, {id: '3', name: '回族'}, {id: '4', name: '维吾尔族'}, {id: '5', name: '哈萨克族'}, {id: '6', name: '藏族'}]},
    {key: '婚姻情况', name: 'marriageFlag', value: inpatientRecord.marriageFlag, isEdit: true, options: [{id: '1', name: '未婚'}, {id: '2', name: '已婚'}, {id: '3', name: '离异'}, {id: '4', name: '丧偶'}]},
    {key: '出生地区', name: 'brithPlace', value: inpatientRecord.newNativePlaceProvince + inpatientRecord.newNativePlaceCity, isEdit: true, options: []},
    {key: '职业', name: 'professioinID', value: inpatientRecord.professioinID, isEdit: true, options: [{id: '1', name: '职工'}, {id: '2', name: '商人'}, {id: '3', name: '销售'}, {id: '4', name: '工人'}, {id: '5', name: '农民'}, {id: '6', name: '士兵'}]},
    {key: '现住地区', name: 'currentPlace', value: inpatientRecord.newCurrentAddressProvince + inpatientRecord.newCurrentAddressCity + inpatientRecord.newCurrentAddressTown + inpatientRecord.newCurrentAddressStreet, isEdit: true, options: []},
    {key: '现住详细地址', name: 'newCurrentAddress', value: inpatientRecord.newCurrentAddress},
    {key: '户口地区', name: 'nativePlace', value: inpatientRecord.newHRAddressProvince + inpatientRecord.newHRAddressCity, isEdit: true, options: []},
    {key: '户口详细地址', name: 'newHRAddress', value: inpatientRecord.newHRAddress},
    {key: '工作单位', name: 'companyName', value: inpatientRecord.companyName},
    {key: '工作单位地址', name: 'companyAddress', value: inpatientRecord.companyAddress},
    {key: '工作单位电话', name: 'companyPhone', value: inpatientRecord.companyPhone},
    {key: '联系人', name: 'contactPerson', value: inpatientRecord.contactPerson},
    {key: '与联系人关系', name: 'contactRelationshipFlag', value: inpatientRecord.contactRelationshipFlag, isEdit: true, options: [{id: '1', name: '配偶'}, {id: '2', name: '子女'}, {id: '3', name: '父母'}, {id: '4', name: '兄弟姐妹'}, {id: '5', name: '亲戚'}, {id: '6', name: '朋友'}]},
    {key: '联系人电话', name: 'contactPhone', value: inpatientRecord.contactPhone},
    {key: '联系人地址', name: 'contactAddress', value: inpatientRecord.contactAddress}
  ]
  return (
    <div style={{marginTop: '10px'}}>
      {/*inpatientRecord.recordInfo === '99'*/}
      {1 === 1 ? dataArr.map((item, i) => {
        console.log(item.value)
        return (
          <div key={i} style={{display: 'flex', backgroundColor: '#ffffff', marginBottom: 1}}>
            <div style={{flex: 3, padding: '10px 10px 10px 15px'}}>{item.key}</div>
            <div style={{flex: 8, paddingRight: 15, alignItems: 'right'}}>{item.isEdit
              ? <select style={{textAlign: 'right', height: 35, width: '96%'}} ref={item.name} defaultValue={item.value || ''}>
                {item.options.map((item2) => {
                  return (
                    <option key={item2.id} value={item2.name}>{item2.name}</option>
                  )
                })}
              </select> : <input defaultValue={item.value} style={{textAlign: 'right', height: 30, width: '100%'}} ref={item.name} />}{item.isEdit ? '>' : ''}</div>
          </div>
        )
      })
      : dataArr.map((item, i) => {
        return (
          <div key={i} style={{display: 'flex', backgroundColor: '#ffffff', marginBottom: 1, padding: 10}}>
            <div style={{flex: 1, paddingLeft: 5}}>{item.key}</div>
            <div style={{paddingRight: 5}}>{item.value || ''}</div>
          </div>
        )
      })}
      <style jsx>{`
        select {
          direction: rtl;
        }
        select option {
          direction: ltr;
        }
      `}</style>
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

export default connect(mapStateToProps, { updateInpatientRecord })(InfoEntryScreen)
