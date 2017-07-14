import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
import moment from 'moment'
import _ from 'lodash'
import Router from 'next/router'
import {Loading, RequireLoginCard, FilterCard, FilterSelect, FilterTime, Modal, ModalHeader, ModalFooter, FilterTimeResult, theme, TabHeader, ErrCard, NoDataCard} from 'components'

import {signin, queryOutpatient, queryPatients, queryOutpatientDetail, selectOutpatient} from '../../../ducks'
import { isEmptyObject } from '../../../utils'
class OutpatientScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      payStatus: false,
      selectedId: '',
      startDate: undefined,
      endDate: undefined,
      showFilterModal: false,
      showTipModal: true
    }
  }

  componentWillMount () {
    if (!this.props.token) {
      this.autoSingn()
    }
    if (isEmptyObject(this.props.patients) || isEmptyObject(this.props.outpatient)) {
      this.setState({isInit: true})
      this.queryOutPatient()
    } else {
      const key = Object.keys(this.props.patients)[0]
      this.setState({selectedId: key})
    }
  }

  async autoSingn () {
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
  }

  async queryOutPatient () {
    var userId = await localforage.getItem('userId')
    await this.props.queryOutpatient(this.props.client, {userId})
    await this.props.queryPatients(this.props.client, {userId})
    if (!isEmptyObject(this.props.patients)) {
      const key = Object.keys(this.props.patients)[0]
      this.setState({selectedId: key})
    }
    this.setState({isInit: false})
  }
  getOutPatientArr (outpatient, payStatus, patientId) {
    var outpatients = []
    if (this.state.startDate || this.state.endDate) {
      for (let key in outpatient) {
        if (this.state.startDate && this.state.endDate) {
          if ((new Date(outpatient[key].visitSchedule.visitDate) >= new Date(this.state.startDate)) && (new Date(outpatient[key].visitSchedule.visitDate) <= new Date(this.state.endDate))) {
            if (outpatient[key].payStatus === payStatus && outpatient[key].patientId === patientId) {
              outpatients.push(outpatient[key])
            }
          }
        } else {
          if (this.state.startDate) {
            if (new Date(outpatient[key].visitSchedule.visitDate) >= new Date(this.state.startDate)) {
              if (outpatient[key].payStatus === payStatus && outpatient[key].patientId === patientId) {
                outpatients.push(outpatient[key])
              }
            }
          }
          if (this.state.endDate) {
            if (new Date(outpatient[key].visitSchedule.visitDate) <= new Date(this.state.endDate)) {
              if (outpatient[key].payStatus === payStatus && outpatient[key].patientId === patientId) {
                outpatients.push(outpatient[key])
              }
            }
          }
        }
      }
    } else {
      for (let key in outpatient) {
        if (outpatient[key].payStatus === payStatus && outpatient[key].patientId === patientId) {
          outpatients.push(outpatient[key])
        }
      }
    }
    return outpatients
  }

  renderModal() {
    let modalHtml;
    {
      this.state.showTipModal ?
      modalHtml = <Modal showModalState={this.state.showTipModal || this.state.showFilterModal}>
        <ModalHeader classChild='modalheaderTip'>缴费退费须知</ModalHeader>
        <div style={{padding: 20, color: theme.fontcolor}}>
          <p>尊敬的患者：</p>
          <p>您好，如果您交费后有退费要求时，应根据不同的退费情况提供所需单据。</p>
          <p>1.退检查、治疗、化验、CT、核磁等费用时需具备：</p>
          <p>(1)由医生开出的退款凭证；</p>
          <p>(2)盖过收费章的原交费单。</p>
          <p>2.退未取药的药费处方需具备：</p>
          <p>(1)原申请单或处方单。</p>
          <p>谢谢您的合作！</p>
        </div>
        <ModalFooter>
          <button className='modalBtn modalOnlyBtn' onClick={(e) => {this.setState({showTipModal: false})}}>确定</button>
        </ModalFooter>
      </Modal>
    :
      modalHtml = <Modal showModalState={this.state.showTipModal || this.state.showFilterModal}>
        <ModalHeader>请选择起止时间</ModalHeader>
        <div className='flex' style={{padding: 20}}>
          <input type='date' ref='startDate' defaultValue={this.state.startDate}
            style={{border: '1px solid #ccc', flex: 6}} name='startDate' max={this.state.maxDate} />
          <span style={{flex: 1, padding: 5, textAlign: 'center'}}> - </span>
          <input type='date' ref='endDate' defaultValue={this.state.endDate}
            style={{border: '1px solid #ccc', flex: 6}} name='endDate' max={this.state.maxDate} />
        </div>
        <ModalFooter>
          <button className='modalBtn modalBtnBorder' onClick={(e) => {this.setState({showFilterModal: false})}}>取消</button>
          <button className='modalBtn modalMainBtn' onClick={(e) => {
            this.setState({startDate: this.refs.startDate.value || undefined})
            this.setState({endDate: this.refs.endDate.value || undefined})
            this.setState({showFilterModal: false})
          }}
          >确定</button>
        </ModalFooter>
      </Modal>
    }
    return modalHtml
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
            console.log('------changePatientSelect', e.target.value);
            this.setState({
              selectedId: e.target.value,
              startDate: undefined,
              endDate: undefined
            })
          }}
          patientArr = {patientArr}
        />
        <FilterTime clickShowFilterModal={() => {this.setState({showFilterModal: true})}} />
      </FilterCard>
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
      return (<div><Loading showLoading>loading...</Loading></div>)
    }
    if (this.props.error) {
      return (<div><ErrCard /></div>)
    }
    var outpatients = this.getOutPatientArr(this.props.outpatient, this.state.payStatus, this.state.selectedId)
    const types = [{text: '未缴费', value: false}, {text: '已缴费', value: true}]
    return (
      <div>
        {this.renderModal()}
        {this.renderPatientList()}
        <FilterTimeResult startDate={this.state.startDate} endDate={this.state.endDate} />
        <TabHeader types={types} curPayStatue={this.state.payStatus}
          clickTab={(type) => {this.setState({payStatus: type})}} />
        {
          outpatients.length > 0 ? outpatients.map((outpatient) => {
            let buttonClass = 'btnBorder btnBorderMain'
            let buttonText = '去缴费'
            if (outpatient.visitSchedule.visitDate < moment().format('YYYY-MM-DD')) {
              buttonClass = 'btnBorder btnBorderDisabled'
              buttonText = '已过期'
            }
            return (
              <div key={outpatient.id} className='list' onClick={() => {
                this.props.selectOutpatient({id: outpatient.id})
                Router.push('/outpatient/outpatient_detail?outpatientId=' + outpatient.id)
              }}>
                <ul className='listTop'>
                  <li className='flex'><span>就诊科室</span><i>{outpatient.department.deptName}</i></li>
                  <li className='flex'><span>医生姓名</span><i>{outpatient.doctor.doctorName}</i></li>
                  <li className='flex'><span>就诊人</span><i>{outpatient.patientName}</i></li>
                  <li className='flex'><span>就诊时间</span><i>{outpatient.visitSchedule.visitDate} {outpatient.visitSchedule.amPm === 'a' ? '上午' : '下午'}</i></li>
                  <li className='totleFee flex'><span></span><i>¥{this.props.url.query.key === 'outpatient' ? outpatient.treatFee : outpatient.registerFee}</i></li>
                  {/*<li className='totleFeeArticle flex'><span></span><i>(医保 0.00  自费 ¥0.00)</i></li>*/}
                  <li className='clearfix'>&nbsp;</li>
                </ul>
                {
                  !outpatient.payStatus
                  ? <div style={{borderTop: '1px solid #d8d8d8', padding: '.06rem .15rem', textAlign: 'right'}}>
                    <button className={buttonClass} onClick={(e) => {
                      e.stopPropagation()
                      Router.push('/outpatient/select_pay_way?outpatientId=' + outpatient.id)
                    }}>{buttonText}</button>
                  </div>
                  : ''
                }
                <style jsx>{`
                  .list{
                    background: #fff;
                    margin-bottom: ${theme.tbmargin};

                  }
                  .listTop{
                    padding: ${theme.tbmargin} 0;
                  }
                  .listTop li{
                    justify-content: space-between;
                    color: ${theme.nfontcolor};
                    font-size: .14rem;
                    line-height: .24rem;
                    padding: 0 ${theme.lrmargin};
                  }
                  .listTop i{
                    font-style: normal
                    color: ${theme.mainfontcolor};
                  }
                  .listTop .totleFee i{
                    font-size: ${theme.fontsize};
                    color: #F39800;
                    font-weight: bold;
                  }
                  .listTop .totleFeeArticle i{
                    font-size: ${theme.nfontsize};
                    color: ${theme.nfontcolor};
                  }
                `}</style>
              </div>
            )
          })
          : <div>
            <NoDataCard />
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    token: state.user.data.token,
    outpatient: state.outpatient.data,
    patients: state.patients.data,
    loading: state.outpatient.loading || state.patients.loading,
    error: state.outpatient.error || state.patients.error
  }
}

export default connect(mapStateToProps, {signin, queryOutpatient, queryPatients, queryOutpatientDetail, selectOutpatient})(OutpatientScreen)
