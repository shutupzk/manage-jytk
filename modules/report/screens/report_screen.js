import React, {Component } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import localforage from 'localforage'
import _ from 'lodash'
import moment from 'moment'
import {REPORT} from 'config'
import {Loading, RequireLoginCard, FilterCard, FilterSelect, FilterTime, Modal, ModalHeader, ModalFooter, TabHeader, theme, Prompt, CardWhite, ErrCard, NoDataCard} from 'components'
// import RangeDemo from '../components/date_rang'

import {
  signin,
  // queryUser,
  queryPatients,
  selectPatient,
  queryExaminations,
  selectExamination,
  queryLaboratories,
  selectLaboratory
} from '../../../ducks'
import { isEmptyObject } from '../../../utils'

class ReportScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      selectPatientId: '',
      type: 'lab',
      maxDate: moment().format('YYYY-MM-DD'),
      startDate: undefined,
      endDate: undefined,
      showFilterModal: false,
      isValidation: false,
      isShow: false,
      autoClose: true,
      closeTime: 2,
      promptContent: ''
    }
  }
  componentWillMount () {
    // if (isEmptyObject(this.props.patients)) {
    //   this.setState({isInit: true})
    //   this.queryPatientReports()
    // } else {
    //   this.setState({isInit: true})
    //   this.queryReport()
    // }
    this.autoSignin()
    this.queryPatient(this.props)
  }
  async autoSignin () {
    if (!this.props.token) {
      const error = await this.props.signin({ username: null, password: null })
      if (error) return console.log(error)
    }
  }
  componentWillReceiveProps (nextProps) {
    if (!isEmptyObject(nextProps.patients) && isEmptyObject(nextProps.laboratories) && !nextProps.selectPatientId) {
      this.queryPatient(nextProps)
    } else if (this.state.selectPatientId !== nextProps.selectPatientId) {
      this.queryReport(nextProps.selectPatientId)
      this.setState({selectPatientId: nextProps.selectPatientId})
    }
  }
  getPatient (patients) {
    let patient = {}
    for (let id in patients) {
      patient = patients[id]
      break
    }
    return patient
  }

  selectPatient (patientId) {
    this.props.selectPatient({patientId})
  }

  queryReport (patientId) {
    // let patient = this.getPatient(this.props.patients)
    // let patientId = patient.id
    this.props.queryExaminations(this.props.client, {patientId})
    this.props.queryLaboratories(this.props.client, {patientId})
  }
  async queryPatient (props) {
    // const error = await this.props.signin({ username: null, password: null })
    // if (error) return console.log(error)
    // const userId = this.props.userId || await localforage.getItem('userId')
    // if (userId) {
    //   // this.props.queryUser(this.props.client, { userId })
    //   await this.props.queryPatients(this.props.client, {userId})
    //   this.queryReport()
    // }
    const patients = props.patients
    if (isEmptyObject(patients)) {
      var userId = await localforage.getItem('userId')
      props.queryPatients(props.client, {userId})
    } else {
      let array = []
      for (let i in patients) {
        if (patients[i] && patients[i].id) {
          array.push(patients[i])
        }
      }
      if (array.length > 0) {
        this.selectPatient(array[0].id)
      }
    }
  }
  renderExamination () {
    let examinationData = this.props.examinations
    const examinations = this.filterLabs(examinationData)
    if (!isEmptyObject(examinations)) {
      return (
        <div>
          {
            examinations.map((item, i) => {
              return (
                <div className={'itemView'} key={i}>
                  <div className={'itemTitleView flex'}>
                    <span>{Object.keys(item)[0]}</span>
                    <span>[{item[Object.keys(item)[0]].length}项]</span>
                  </div>
                  <ul className={'itemContentsView'}>
                    {
                      item[Object.keys(item)[0]].map((item, i) => (
                        <li key={item.id}
                          onClick={() => {
                            this.props.selectExamination({
                              date: item.reportTime,
                              examinationId: item.id
                            })
                            Router.push('/report/examination_detail?examinationId=' + item.id + '&date=' + item.reportTime)
                          }}>
                          {item.exammineName}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              )
            })
          }
        </div>
      )
    } else {
      return <div><NoDataCard /></div>
    }
  }
  filterLabs (laboratorieData) {
    let labs = []
    if (this.state.startDate || this.state.endDate) {
      for (let lab of laboratorieData) {
        if (this.state.startDate && this.state.endDate) {
          if ((new Date(Object.keys(lab)[0]) >= new Date(this.state.startDate)) && (new Date(Object.keys(lab)[0]) <= new Date(this.state.endDate))) {
            labs.push(lab)
          }
        } else {
          if (this.state.startDate) {
            if (new Date(Object.keys(lab)[0]) >= new Date(this.state.startDate)) {
              labs.push(lab)
            }
          }
          if (this.state.endDate) {
            if (new Date(Object.keys(lab)[0]) <= new Date(this.state.endDate)) {
              labs.push(lab)
            }
          }
        }
      }
    } else {
      labs = Object.assign([], laboratorieData)
    }
    return labs
  }


  renderPatientList () {
    const patients = this.props.patients
    let patientArr = []
    _.mapKeys(patients, (patient) => {
      patientArr.push(patient)
    })
    return (
      <FilterCard>
        <FilterSelect
          changePatientSelect={(e) => {
            console.log('------changePatientSelect', e.target.value)
            this.props.selectPatient({patientId: e.target.value})
            this.setState({
              startDate: undefined,
              endDate: undefined,
              isValidation: false
            })
          }}
          patientArr = {patientArr}
        />
        {
          !REPORT.needPassword || this.state.isValidation ? <FilterTime clickShowFilterModal={() => {this.setState({showFilterModal: true})}} /> : ''
        }
      </FilterCard>
    )
  }

  renderModal() {
    let modalHtml;
    modalHtml = <Modal showModalState={this.state.showTipModal || this.state.showFilterModal}>
      <ModalHeader>请选择起止时间</ModalHeader>
      <div className='flex' style={{padding: 20}}>
        <input type='date' defaultValue={this.state.startDate} ref='startDate'
          style={{border: '1px solid #ccc', flex: 6}} name='startDate' max={this.state.maxDate} />
        <span style={{flex: 1, padding: 5, textAlign: 'center'}}> - </span>
        <input type='date' defaultValue={this.state.endDate} ref='endDate'
          style={{border: '1px solid #ccc', flex: 6}} name='endDate' max={this.state.maxDate} />
      </div>
      <ModalFooter>
        <button className='modalBtn modalBtnBorder' onClick={(e) => {this.setState({showFilterModal: false})}}>取消</button>
        <button className='modalBtn modalMainBtn' onClick={(e) => {
          this.setState({startDate: this.refs.startDate.value || undefined})
          this.setState({endDate: this.refs.endDate.value || undefined})
          this.setState({showFilterModal: false})
        }}>确定</button>
      </ModalFooter>
    </Modal>
    return modalHtml;
  }

  renderLaboratory () {
    let laboratorieData = this.props.laboratories
    const laboratories = this.filterLabs(laboratorieData, this.state.selectPatientId)
    if (!isEmptyObject(laboratories)) {
      return (
        <div>
          {
            laboratories.map((item, i) => {
              return (
                <div className={'itemView'} key={i}>
                  <div className={'itemTitleView flex'}>
                    <span>{Object.keys(item)[0]}</span>
                    <span>[{item[Object.keys(item)[0]].length}项]</span>
                  </div>
                  <ul className={'itemContentsView'}>
                    {
                      item[Object.keys(item)[0]].map((item, i) => (
                        <li key={item.id}
                          onClick={() => {
                            this.props.selectLaboratory({
                              date: item.reportTime,
                              laboratoryId: item.id
                            })
                            Router.push('/report/laboratory_detail?laboratoryId=' + item.id + '&date=' + item.reportTime)
                          }}>
                          {item.inspectName}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              )
            })
          }
        </div>
      )
    } else {
      return <div><NoDataCard /></div>
    }
  }

  renderPassword () {
    return (
      <div style={{backgroundColor: '#fff', padding: 50}}>
        <div style={{textAlign: 'center'}}>请输入服务密码</div>
        <div><input ref='reportPassword' type='password' maxLength='6'
          style={{letterSpacing: '30', marginTop: 20, borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: 'solid 1px #aaa', height: 30, width: '100%'}}
          onChange={(e) => {
            if (e.target.value.length === 6) {
              if (e.target.value === '123456') {
                this.setState({
                  isValidation: true
                })
              } else {
                this.setState({
                  promptContent: '密码错误！',
                  isShow: true,
                  closeTime: 1
                })
              }
            }
          }}
        /></div>
        <div style={{marginTop: 30}}>如果还未获取服务密码，请在检查预约人工窗口获取。</div>
      </div>
    )
  }

  render () {
    if (!this.props.token) {
      return (
        <div>
          <span><RequireLoginCard /></span>
        </div>
      )
    }
    if (this.props.loading || this.state.isInit) {
      return (
        <div><Loading showLoading>loading...</Loading></div>
      )
    }
    if (this.props.error) {
      return (
        <div><ErrCard /></div>
      )
    }
    const types = REPORT.reportType
    return (
      <div>
        <div style={{width: '100%'}}>
          {this.renderModal()}
          {this.renderPatientList()}
          {
            !REPORT.needPassword || this.state.isValidation
            ? <div>
              {
              REPORT.reportType.length > 1
              ? <div>
                <TabHeader types={types} curPayStatue={this.state.type}
                  clickTab={(type) => { this.setState({type: type}) }} />
                {
                  this.state.type === 'lab' ? this.renderLaboratory() : this.renderExamination()
                }
              </div>
              : this.renderLaboratory()
            }</div>
            : this.renderPassword()
          }
        </div>
        <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
        <style jsx global>{`
          .itemView {
            margin-bottom: 10px;
            background: #fff;
          }
          .itemTitleView {
            background: #fff;
            color: ${theme.nfontcolor};
            font-size: ${theme.nfontsize};
            border-top: 1px solid ${theme.bordercolor};
            border-bottom: 1px solid ${theme.bordercolor};
            padding: .06rem ${theme.lrmargin};
            justify-content: space-between;
          }
          .itemContentsView li {
            line-height: .42rem;
            padding: 0 ${theme.lrmargin};
            color: ${theme.mainfontcolor};
          }
          .itemContentsView li:nth-of-type(2n+1) {
            background: #f9f9f9;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    patients: state.patients.data,
    selectPatientId: state.patients.selectId,
    examinations: state.examinations.data,
    laboratories: state.laboratories.data,
    examinationLoading: state.examinations.loading,
    examinationError: state.examinations.error,
    laboratoryLoading: state.laboratories.loading,
    laboratoryError: state.laboratories.error
  }
}

export default connect(mapStateToProps, {
  signin,
  // queryUser,
  queryPatients,
  selectPatient,
  queryExaminations,
  selectExamination,
  queryLaboratories,
  selectLaboratory
})(ReportScreen)
