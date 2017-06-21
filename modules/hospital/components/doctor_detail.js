import DoctorTitleCard from './doctor_title'
import DoctorIntro from './doctor_intro'
import DoctorScheduleList from './doctor_schedule_list'
import DoctorDescription from './doctor_description'
import DoctorAwards from './doctor_awards'

// button: 我要评价
function renderBottomButton (doc, gotoEvaluate) {
  return (
    <div style={{position: 'fixed', bottom: '0px', width: '90%', height: '40px'}}>
      <button onClick={() => { gotoEvaluate() }} style={{width: '100%', display: 'block', backgroundColor: '#3CA0FF', height: '40px', borderRadius: '10px', fontSize: 16}}>我要评价</button>
    </div>
  )
}

export default (props) => {
  let doctor = props.doctor
  const isMyDoc = props.isMyDoc
  // let schedules = props.schedules
  let gotoEvaluate = props.gotoEvaluate
  const toMyDoctor = props.toMyDoctor
  return (
    <div className='container'>
      <div style={{overflow: 'auto', marginBottom: '60px'}}>
        <DoctorTitleCard doctor={doctor} isMyDoc={isMyDoc} toMyDoctor={toMyDoctor} />
        <DoctorIntro doctor={doctor} />
        <DoctorScheduleList {...props} />
        <DoctorDescription doctor={doctor} />
        <DoctorAwards doctor={doctor} />
      </div>
      {
        renderBottomButton(doctor, gotoEvaluate)
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
