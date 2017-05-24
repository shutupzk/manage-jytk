import DoctorTitleCard from '../../hospital/components/doctor_title'
import DoctorIntro from '../../hospital/components/doctor_intro'
import DoctorScheduleList from '../../hospital/components/doctor_schedule_list'
import DoctorDescription from '../../hospital/components/doctor_description'
import DoctorAwards from '../../hospital/components/doctor_awards'

export default (props) => {
  let doctor = props.doctor
  // let schedules = props.schedules
  // let goDetail = props.goDetail
  let height = window.innerHeight - 100
  let width = window.innerWidth - 90
  return (
    <div className='container' style={{height: height, overflow: 'auto', marginRight: -10, paddingRight: 10, width: width}}>
      <div>
        <DoctorTitleCard doctor={doctor} />
        <DoctorIntro doctor={doctor} />
        <DoctorScheduleList {...props} />
        <DoctorDescription doctor={doctor} />
        <DoctorAwards doctor={doctor} />
      </div>
      <style jsx>{`
        .container {
          {/*height: 520px;*/}
          overflow: auto;
          flex: 7;
          background-color: white;
        }
      `}</style>
    </div>
  )
}