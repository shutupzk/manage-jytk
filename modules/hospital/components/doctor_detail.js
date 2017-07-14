import DoctorTitleCard from './doctor_title'
import DoctorIntro from './doctor_intro'
import DoctorScheduleList from './doctor_schedule_list'
import DoctorDescription from './doctor_description'
import DoctorAwards from './doctor_awards'
import {HOSPITAL_NAME} from 'config'

// button: 我要评价
function renderBottomButton (doc, gotoEvaluate) {
  return (
    <div style={{margin: '20px 15px'}}>
      <button onClick={() => { gotoEvaluate() }} className='btnBG btnBGMain'>我要评价</button>
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
      <div style={{overflow: 'auto', margin: '10px 15px'}}>
        <DoctorTitleCard doctor={doctor} isMyDoc={isMyDoc} toMyDoctor={toMyDoctor} />
        <DoctorIntro doctor={doctor} />
        <DoctorScheduleList {...props} />
        <DoctorDescription doctor={doctor} />
        <DoctorAwards doctor={doctor} />
      </div>
      {
        HOSPITAL_NAME.indexOf('鲁中') > -1 ?
          ''
        :
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
