import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERINFO} from 'config'
import { queryAppointmentDetail } from '../../../ducks'
import { connect } from 'react-redux'


class AppointDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    const {id} = this.props.url && this.props.url.query || {}
    this.props.queryAppointmentDetail(this.props.client, {id})
  }

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
    }
    const appointment = this.props.appointment || {};
    const patient = appointment.patientCard && appointment.patientCard.patient || {}
    const info = [
      {title: '患者姓名', apiKey: '', type: 'input'},
      // {title: '患者类型', apiKey: '', type: 'input'},
      {title: '患者证件号', apiKey: '', type: 'input'},
      {title: '就诊人就诊卡号', apiKey: '', type: 'input'},
      {title: '就诊人电话号码', apiKey: '', type: 'input'},
      {title: '医院名称', apiKey: '', type: 'input'},
      {title: '科室名称', apiKey: '', type: 'input'},
      {title: '医生名称', apiKey: '', type: 'input'},
      {title: '医生职称', apiKey: '', type: 'input'},
      {title: '就诊号', apiKey: '', type: 'input'},
      {title: '挂号费', apiKey: '', type: 'input'},
      {title: '支付方式', apiKey: '', type: 'input'},
      // {title: '第三方支付订单号', apiKey: '', type: 'input'},
      {title: '就诊时间', apiKey: '', type: 'input'},
      {title: '上午、下午', apiKey: '', type: 'input'},
      {title: '挂号状态', apiKey: '', type: 'input'}
    ]
    return (
      <div>
        <section>
          {
            info && info.map((infoItem, infoKey) => {
              const detailCon = `detailCon${infoKey}`
              return (
                <dl key={infoKey} className='flex tb-flex'
                  style={{fontSize: theme.fontsize, lineHeight: '.3rem', margin: theme.tbmargin}}>
                  <dt style={{width: '30%', textAlign: 'right', color: theme.fontcolor, paddingRight: theme.tbmargin}}>{infoItem.title}</dt>
                  {eval(detailCon + '(appointment, infoItem)')}
                </dl>
              )
            })
          }
        </section>
      </div>
    )
  }
}

const normalHtml = (data) => {
	return (
    <dd style={{color: theme.mainfontcolor, background: '#fefefe', width: '50%', border: `1px solid ${theme.nbordercolor}`, textIndent: theme.midmargin}}>
      {data || '未知'}
    </dd>
	)
}

const detailCon0 = (appointment, infoItem) => {return (normalHtml(appointment.patientCard && appointment.patientCard.patient && appointment.patientCard.patient.name))}
const detailCon1 = (appointment, infoItem) => {return (normalHtml(appointment.patientCard && appointment.patientCard.patient && appointment.patientCard.patient.certificateNo))}
const detailCon2 = (appointment, infoItem) => {return (normalHtml(appointment.patientCard && appointment.patientCard.patientIdNo))}
const detailCon3 = (appointment, infoItem) => {return (normalHtml(appointment.patientCard && appointment.patientCard.patient && appointment.patientCard.patient.phone))}
const detailCon4 = (appointment, infoItem) => {return (normalHtml(appointment.patientCard && appointment.patientCard.hospital && appointment.patientCard.hospital.hospitalName))}
const detailCon5 = (appointment, infoItem) => {return (normalHtml(appointment.visitSchedule && appointment.visitSchedule.department && appointment.visitSchedule.department.deptName))}
const detailCon6 = (appointment, infoItem) => {return (normalHtml(appointment.visitSchedule && appointment.visitSchedule.doctor && appointment.visitSchedule.doctor.doctorName))}
const detailCon7 = (appointment, infoItem) => {return (normalHtml(appointment.patientCard && appointment.patientCard.patient && appointment.patientCard.patient.name))}
const detailCon8 = (appointment, infoItem) => {return (normalHtml(appointment.visitNo))}
const detailCon9 = (appointment, infoItem) => {return (normalHtml(appointment.visitSchedule && appointment.visitSchedule.registerFee))}
const detailCon10 = (appointment, infoItem) => {return (normalHtml(appointment.payType))}
const detailCon11 = (appointment, infoItem) => {return (normalHtml(appointment.visitSchedule && appointment.visitSchedule.visitDate))}
const detailCon12 = (appointment, infoItem) => {return (normalHtml(appointment.visitSchedule && appointment.visitSchedule.amPm === 'P' ? '下午' : '上午'))}
const detailCon13 = (appointment, infoItem) => {
  let status;
  for (let statusItem of ORDERINFO.appoint_visit_status) {
    if (statusItem.value === appointment.visitStatus) {
      status = statusItem.title
    }
  }
  return (
    normalHtml(status)
  )
}

function mapStateToProps (state) {
  return {
    appointment: state.appointments.data.appointment,
    loading: state.order.loading,
    error: state.order.error
  }
}

export default connect(mapStateToProps, { queryAppointmentDetail })(AppointDetailScreen)
