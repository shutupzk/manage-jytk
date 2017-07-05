import DoctorTitleCard from '../../hospital/components/doctor_title'
import DoctorIntro from '../../hospital/components/doctor_intro'
import DoctorScheduleList from '../../hospital/components/doctor_schedule_list'
import DoctorDescription from '../../hospital/components/doctor_description'
import DoctorAwards from '../../hospital/components/doctor_awards'
import {theme} from 'components'

export default (props) => {
  let doctor = props.doctor
  const isMyDoc = props.isMyDoc
  const toMyDoctor = props.toMyDoctor
  // let schedules = props.schedules
  // let goDetail = props.goDetail
  let height = window.innerHeight - 100
  let width = window.innerWidth - 90
  return (
    <div className='container' style={{paddingTop: theme.tbmargin, paddingBottom: theme.tbmargin, paddingLeft: theme.lrmargin, paddingRight: theme.lrmargin, background: '#fff'}}>
      <div>
        <DoctorTitleCard doctor={doctor} isMyDoc={isMyDoc} toMyDoctor={toMyDoctor} />
        <DoctorIntro doctor={doctor} />
        <DoctorScheduleList {...props} />
        <DoctorDescription doctor={doctor} />
        <DoctorAwards doctor={doctor} />
      </div>
    </div>
  )
}
