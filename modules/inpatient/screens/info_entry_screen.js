import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateInpatientRecord } from '../../../ducks'
import {theme} from 'components'

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

        {1 === 1 ? <div>
          <button className='fullWidthFixed fullWidthBtn fullWidthBtnMain' onClick={() => { this.updateInpatientRecord(inpatientRecord.id, inpatientRecord.inpatientCardId) }}>提交</button>
        </div> : ''}
      </div>
    )
  }
}

const topInfo = (inpatientRecord, props) => {
  const patient = props.patientsData[inpatientRecord.patientId]
  return (
    <div>
      <div style={{ padding: '10px 15px', marginBottom: 1, backgroundColor: '#ffffff', fontSize: 18, color: theme.mainfontcolor }}>{ inpatientRecord.name }</div>
      <div style={{ padding: '10px 15px', backgroundColor: '#ffffff', fontSize: '14px' }}>
        <div style={{ display: 'flex', lineHeight: '30px' }}>
          <div style={{color: theme.fontcolor, paddingRight: theme.tbmargin}}>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</div>
          <div style={{color: theme.mainfontcolor}}>{patient.sex === '1' ? '男' : '女'}</div>
        </div>
        <div style={{ display: 'flex', lineHeight: '30px' }}>
          <div style={{color: theme.fontcolor, paddingRight: theme.tbmargin}}>出生日期</div>
          <div style={{color: theme.mainfontcolor}}>{patient.birthday}</div>
        </div>
        <div style={{ display: 'flex', lineHeight: '30px' }}>
          <div style={{color: theme.fontcolor, paddingRight: theme.tbmargin}}>联系电话</div>
          <div style={{color: theme.mainfontcolor}}>{patient.phone}</div>
        </div>
        <div style={{ display: 'flex', lineHeight: '30px' }}>
          <div style={{color: theme.fontcolor, paddingRight: theme.tbmargin}}>身份证号</div>
          <div style={{color: theme.mainfontcolor}}>{patient.certificateNo}</div>
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
    <div style={{marginTop: '10px', marginBottom: '60px'}}>
      {/*inpatientRecord.recordInfo === '99'*/}
      {1 === 1 ? dataArr.map((item, i) => {
        console.log(item.value)
        return (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', backgroundColor: '#ffffff', marginBottom: 1, padding: '0 15px', lineHeight: '40px'}}>
            <div style={{fontSize: '14px', color: theme.fontcolor}}>{item.key}</div>
            <div className='select flex tb-flex' style={{alignItems: 'right', border: 'none', width: 'auto', padding: 0}}>{item.isEdit
              ?
              <div className='flex tb-flex' style={{width: '100%'}}>
                <select style={{textAlign: 'right', height: 40, lineHeight: '40px', color: theme.mainfontcolor, fontSize: theme.fontsize, fontWeight: 300, paddingRight: 6}} ref={item.name} defaultValue={item.value || ''}>
                  {item.options.map((item2) => {
                    return (
                      <option key={item2.id} value={item2.name}>{item2.name}</option>
                    )
                  })}
                </select>
                <p className='back-left' style={{transform: 'rotate(135deg)'}}></p>
              </div>
              : <input defaultValue={item.value} style={{border: 'none', textAlign: 'right', height: 40, lineHeight: '40px', color: theme.mainfontcolor, fontSize: theme.fontsize, fontWeight: 300, paddingRight: 6, width: '100%'}} ref={item.name} />}</div>
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
