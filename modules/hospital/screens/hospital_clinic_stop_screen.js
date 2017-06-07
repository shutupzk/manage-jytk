import React, { Component } from 'react'
import { connect } from 'react-redux'
import { queryClinicStops } from '../../../ducks'


class HospitalClinicStop extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false
    }
  }
  componentWillMount () {
    this.queryData()
  }
  async queryData () {
    this.setState({isInit: true})
    await this.props.queryClinicStops(this.props.client)
    this.setState({isInit: false})
  }
  render () {
    if (this.props.loading || this.state.isInit) {
      return (
        <div>loading...</div>
      )
    }
    if (this.props.error) {
      return (
        <div>error...</div>
      )
    }
    const clinicStops = this.props.clinicStops
    return (
      <div className='container'>
        {
          clinicStops.map((clinicStop) => {
            let imagUrl = clinicStop.departmentHasDoctors.doctor.avatar || '/static/icons/doctor_head.png'
            return (
              <div key={clinicStop.id} style={{height: 60, backgroundColor: '#ffffff', marginBottom: 3, padding: 10, display: 'flex'}}>
                <div>
                  <img src={imagUrl} style={{height: 60, width: 60}} />
                </div>
                <div>
                  <div><span style={{fontSize: 15}}>{clinicStop.departmentHasDoctors.doctor.doctorName}</span><span>{clinicStop.departmentHasDoctors.doctor.title}</span></div>
                  <div>{clinicStop.departmentHasDoctors.department.deptName}</div>
                  <div>停诊时间：{clinicStop.date} {clinicStop.amPm === 'a' ? '上午' : '下午'}</div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    loading: state.clinicStops.loading,
    error: state.clinicStops.error,
    clinicStops: state.clinicStops.data
  }
}

export default connect(mapStateToProps, { queryClinicStops })(HospitalClinicStop)
