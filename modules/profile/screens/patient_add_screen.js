import React, { Component } from 'react'
import _ from 'lodash'
import Router from 'next/router'
import localforage from 'localforage'
// import { SubButton } from '../components'
import { ages, getBirthday, getSex } from '../../../utils'
import { addPatient, queryPatients, updatePatientDefault } from '../../../ducks'
import { connect } from 'react-redux'

class PatientAddScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      status: false,
      relationship: '02',
      relationshipText: '请选择您与就诊人的关系',
      birthday: '出生日期',
      sexText: '性别',
      default: false,
      animating: false
    }
    this.addPatient = this.addPatient.bind(this)
  }
  changeCheckbox (e) {
    this.setState({default: e.target.checked})
  }
  async addPatient () {
    const userId = this.props.userId || await localforage.getItem('userId')
    console.log(userId)
    const name = this.state.name
    const phone = this.state.phone
    const certificateNo = this.state.certificateNo
    const relationship = this.state.relationship
    const carteVital = this.state.carteVital
    const isDefault = this.state.default
    if (!name) {
      return this.popup.alert('姓名不能为空')
    }
    if (!phone) {
      return this.popup.alert('手机号不能为空')
    }
    if (phone.length !== 11) {
      return this.popup.alert('手机号格式不正确')
    }
    if (!certificateNo) {
      return this.popup.alert('身份证不能为空')
    }
    if (certificateNo.length !== 18) {
      return this.popup.alert('手机号格式不正确')
    }
    if (!relationship) {
      return this.popup.alert('关系不能为空')
    }
    this.setState({animating: true})
    const error = await this.props.addPatient(this.props.client, { userId, name, phone, certificateNo, relationship, carteVital, isDefault })
    // const error2 = await this.props.queryPatients(this.props.client, {userId})
    if (isDefault) {
      const patients = await _.omit(this.props.patients, error.data)
      const patientIds = await _.keys(patients)
      var me = this
      patientIds.map(async (patientId) => {
        const error3 = await me.props.updatePatientDefault(me.props.client, {patientId, isDefault: false})
        if (error3) return this.popup.alert(error3)
      })
    }
    this.setState({animating: false})
    if (error.error) return this.popup.alert(error.error)
    return this.props.url.back()// Router.push('/profile/patient_list')
  }
  render () {
    const relations = [
      { key: '01', value: '本人' },
      { key: '02', value: '家庭成员' },
      { key: '03', value: '亲戚' },
      { key: '04', value: '朋友' },
      { key: '05', value: '其他' }
    ]
    return (
      <div className='container' style={styles.container}>
        <div style={styles.list}>
          <div style={styles.item} key={'name'}>
            <span style={styles.textLeft}>&nbsp;姓&nbsp; 名&nbsp;</span>
            <input placeholder={'输入您的真实姓名'} className='textInput' style={styles.itemViewRight}
              onChange={(e) => this.setState({ name: e.target.value })} />
          </div>
          <div style={styles.item} key={'certificateNo'}>
            <span style={styles.textLeft}> 身份证号 </span>
            <input placeholder={'输入身份证号'} className='textInput' style={styles.itemViewRight}
              onChange={(e) => {
                var certificateNo = e.target.value
                if (certificateNo.length === 18) {
                  const birthday = getBirthday(certificateNo)
                  const sex = getSex(certificateNo)
                  const sexText = sex === '0' ? '女' : '男'
                  const age = ages(birthday) + ''
                  const ageText = age + '岁'
                  this.setState({ certificateNo, birthday, age, ageText, sex, sexText })
                }
              }} />
          </div>
          <div style={styles.item} key={'sex'}>
            <span style={styles.textLeft}>&nbsp;性&nbsp; 别&nbsp;</span>
            <input placeholder={this.state.sexText} className='textInput' style={styles.itemViewRight} disabled />
          </div>
          <div style={styles.item} key={'birthday'}>
            <span style={styles.textLeft}> 出生日期 </span>
            <input placeholder={this.state.birthday} className='textInput' style={styles.itemViewRight} disabled />
          </div>
          <div style={styles.item} key={'phone'}>
            <span style={styles.textLeft}> 手 机 号 </span>
            <input placeholder={'输入手机号'} className='textInput' style={styles.itemViewRight}
              onChange={(e) => this.setState({ phone: e.target.value })} />
          </div>
          {/* <div style={styles.item} key={'relationship'}>
            <span style={styles.textLeft}>与本人关系</span>
            <input placeholder={'与本人关系'} className='textInput' style={styles.itemViewRight}
              onChange={(e) => this.setState({ relationshipText: e.tartet.value })} />
            <div style={styles.itemViewRight}
              onClick={() => {
                this.popupDialog.show()
              }}>
              <div style={styles.selectButton}>
                <span style={{ color: '#B4B4B4', alignSelf: 'center', fontSize: 16, marginRight: 2 }}>{this.state.relationshipText}</span>
                <img src='/static/icons/arrow-down' style={{size: 15}} />
              </div>
            </div>
          </div> */}
          <div style={styles.item} key={'carteVital'}>
            <span style={styles.textLeft}> 医保卡号 </span>
            <input placeholder={'非医保卡号可不填写'} className='textInput' style={styles.itemViewRight}
              onChange={(e) => this.setState({ carteVital: e.target.value })} />
          </div>
          <div style={{marginTop: 20}}>
            <div style={styles.item}>
              <span style={styles.textLeft}>设为默认就诊人</span>
              <input type='checkbox' style={{float: 'right', zoom: '160%', marginRight: 12}} onClick={(e) => this.changeCheckbox(e)} />
            </div>
          </div>
        </div>
        <button className='blockPrimaryBtn' style={{display: 'block', width: '100%'}} onClick={() => this.addPatient()} >完成</button>
        {/* <div
          ref={(popupDialog) => { this.popupDialog = popupDialog }}>
          <div>
            <div id='title'>选择关系</div>
            <div containerStyle={styles.dialogList} >
              {
                relations.map((item, i) => (
                  <div key={item.key}
                    onClick={() => {
                      this.setState({ relationship: item.key, relationshipText: item.value })
                      this.popupDialog.dismiss()
                    }}>
                    <div style={styles.selectItem}>
                      <div style={styles.itemText} >{item.value}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}

const styles = {
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    marginTop: 10
  },
  deleteView: {
    height: 40
  },
  list: {
    borderTopWidth: 0,
    marginTop: 20,
    marginBottom: 5,
    borderBottomWidth: 0
  },
  dialogList: {
    borderTopWidth: 0,
    marginTop: 0,
    borderBottomWidth: 0
  },
  item: {
    height: 51,
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1
  },
  itemLast: {
    height: 51,
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between'
  },
  textLeft: {
    flex: 1,
    fontSize: 16,
    color: '#797979',
    marginLeft: 10
  },
  itemViewRight: {
    width: '58%',
    flex: 2,
    borderBottomWidth: 0,
    float: 'right',
    marginRight: 20
  },
  selectButton: {
    height: 51,
    marginRight: 10,
    flexWrap: 'nowrap',
    flexDirection: 'row'
  },
  selectItem: {
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1
  },
  itemText: {
    color: '#505050',
    fontSize: 18
  },
  buttonStyle: {
    marginTop: 100
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    height: 80
  }
}

function mapStateToProps (state) {
  return {
    patients: state.patients.data,
    userId: state.user.data.id,
    loading: state.patients.loading || state.patients.loading,
    error: state.patients.error || state.patients.error
  }
}


export default connect(mapStateToProps, {addPatient, queryPatients, updatePatientDefault})(PatientAddScreen)
