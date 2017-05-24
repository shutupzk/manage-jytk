import DoctorTitleCard from './doctor_title'
import DoctorIntro from './doctor_intro'
import DoctorScheduleList from './doctor_schedule_list'
import DoctorDescription from './doctor_description'
import DoctorAwards from './doctor_awards'

// button: 我要评价
function renderBottomButton (doc) {
  return (
    <div style={{position: 'absolute', bottom: '15px', width: '90%', height: '40px'}}>
      <button style={{width: '100%', display: 'block', backgroundColor: '#3CA0FF', height: '40px', borderRadius: '10px', fontSize: 16}}>我要评价</button>
    </div>
  )
}

export default (props) => {
  let doctor = props.doctor
  // let schedules = props.schedules
  // let goDetail = props.goDetail
  let height = window.innerHeight - 140
  console.log(window.screen.height)
  console.log(height)
  return (
    <div className='container' style={{height: height, overflow: 'auto'}}>
      <div>
        <DoctorTitleCard doctor={doctor} />
        <DoctorIntro doctor={doctor} />
        <DoctorScheduleList {...props} />
        <DoctorDescription doctor={doctor} />
        <DoctorAwards doctor={doctor} />
      </div>
      {
        renderBottomButton(doctor)
      }
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
