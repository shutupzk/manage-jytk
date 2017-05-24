import React, { Component } from 'react'
import { connect } from 'react-redux'

import DoctorDetail from '../components/doctor_detail'
import { isEmptyObject } from '../../../utils'
import { queryDoctors, selectDoctor, querySchedules, selectSchedule } from '../../../ducks'

const filterDepartments = (departmentIds, departmentId) => {
  let ids = departmentIds.filter((id) => {
    if (departmentId === id) {
      return true
    }
    return false
  })
  if (ids.length > 0) {
    return true
  }
}

const isExistDepartment = (doctors, departmentId) => {
  let selectDoctors = []
  for (let key in doctors) {
    if (filterDepartments(doctors[key].departmentIds, departmentId)) {
      selectDoctors.push(doctors[key])
    }
  }
  return selectDoctors
}

class AppointmentDoctorListScreen extends Component {
  componentWillMount () {
    let doctors = this.props.doctorsData
    let departmentId = this.props.departmentId
    let selectDoctors = isExistDepartment(doctors, departmentId)
    if (isEmptyObject(doctors) || selectDoctors.length === 0) {
      console.log('1')
      this.queryData()
      console.log('5')
    } else {
      console.log('2')
      this.props.selectDoctor({doctorId: selectDoctors[0].id})
    }
  }

  async queryData () {
    let { client, doctors, departmentId, queryDoctors, selectDoctor, querySchedules } = this.props
    await queryDoctors(client, {departmentId})
    console.log('4')
    if (!isEmptyObject(doctors)) {
      console.log('3')
      let selectDoctors = isExistDepartment(doctors, departmentId)
      console.log(selectDoctors[0].id)
      await selectDoctor({ doctorId: selectDoctors[0].id })
      await querySchedules(client, { departmentId, doctorId: selectDoctors[0].id })
    }
  }

  tabRender (selectDoctors, doctor) {
    var departmentId = this.props.departmentId
    if (!doctor) {
      return <div>loading</div>
    }
    var doctorId = doctor.id
    return (
      <div style={{backgroundColor: '#ffffff', width: '100%'}}>
        <div style={{float: 'left', width: '20%'}}>
          <ul id='tab_nav' style={styles.tab_nav}>
            {
              selectDoctors.length > 0 ? selectDoctors.map((doc) => {
                return (
                  <li style={styles.tab_nav_li} key={doc.id} onClick={() => {
                    this.props.selectDoctor({doctorId: doc.id})
                    this.props.querySchedules(this.props.client, { departmentId, doctorId: doc.id })
                  }}>
                    <a style={styles.tab_nav_a}>{doc.doctorName}</a>
                  </li>
                )
              }) : ''
            }
          </ul>
        </div>
        <div id='tab_content' style={{width: '80%', float: 'right'}}>
          <div id={`tab_${doctorId}`} style={{overflow: 'hidden'}}>
            {/*{doctor.doctorName}*/}
            <DoctorDetail doctor={doctor} schedules={this.props.schedules} goDetail={(schedule) => {
              this.props.selectSchedule(schedule.id)
              this.props.url.push('/appointment/schedule_detail')
            }} />
          </div>
        </div>
        <div className='clearfix'>&nbsp;</div>
      </div>
    )
  }
  render () {
    console.log(this.props)
    if (this.props.loading) {
      return <div>loading...</div>
    }
    // 多加判断防止状态为error时，所有的界面都是error
    if (this.props.error) {
      return <div>error...</div>
    }
    let departmentId = this.props.departmentId
    let doctors = this.props.doctors
    let selectDoctors = isExistDepartment(doctors, departmentId)
    console.log(selectDoctors)
    let doctorId = this.props.doctorId || selectDoctors[0].id
    console.log('doctorId')
    console.log(doctorId)
    let doctor = doctors[doctorId]
    return (
      <div className=''>
        <div style={{display: 'flex', textAlign: 'center', backgroundColor: '#ffffff', paddingTop: '10px', paddingBottom: '10px', marginBottom: 5, borderBottom: 'solid 0.2px #eeeeee'}}>
          <li style={{textAlign: 'center', width: '50%', float: 'left', height: '25px', fontSize: '16px'}}>全部日期</li>
          <li style={{textAlign: 'center', width: '50%', float: 'right', height: '25px', fontSize: '16px'}}>按日期挂号</li>
        </div>
        {this.tabRender(selectDoctors, doctor)}
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    loading: state.doctors.loading,
    error: state.doctors.error,
    userId: state.user.data.id,
    doctors: state.doctors.data,
    doctorId: state.doctors.selectId,
    departmentId: state.departments.selectId,
    schedules: state.schedules.data
  }
}

var styles = {
  tab_nav: {
    margin: 0,
    padding: 0,
    height: 30
    // lineHeight: 24
  },
  tab_nav_li: {
    // float: 'left',
    margin: '0 0px',
    listStyle: 'none',
    borderBottom: '1px solid #999',
    height: 30,
    width: '100%',
    textAlign: 'center',
    background: '#FFF'
  },
  tab_nav_a: {
    font: 'bold 14px/24px "微软雅黑", Verdana, Arial, Helvetica, sans-serif',
    color: 'green',
    textDecoration: 'none'
  },
  tab_content: {
    height: 273,
    border: '1px solid #999',
    font: 'bold 4em/273px "微软雅黑", Verdana, Arial, Helvetica, sans-serif',
    textAlign: 'center',
    background: '#FFF',
    overflow: 'hidden'
  },
  tab_content_div: {
    width: '100%',
    height: 273
  }
}

export default connect(mapStateToProps, { queryDoctors, selectDoctor, querySchedules, selectSchedule })(AppointmentDoctorListScreen)
