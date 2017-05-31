import _ from 'lodash'
/**
 * 出诊时间
 */
function DoctorScheduleList (props) {
  let {schedules, goDetail, departmentId, doctor} = props
  console.log(departmentId)
  console.log(doctor.id)
  console.log(schedules)
  let scheduleArr = []
  _.mapValues(schedules, (schedule) => {
    if (schedule.doctorId === doctor.id && schedule.departmentId === departmentId) {
      scheduleArr.push(schedule)
    }
  })
  return (
    <div className='descriptionView'>
      <div style={{fontSize: 14, margin: 5, marginLeft: 10, color: '#B4B4B4'}}>出诊时间</div>
      {
        scheduleArr.map((schedule) => {
          var weekday = ''
          var date = new Date(schedule.visitDate)
          var day = date.getDay()
          switch (day) {
            case 0:
              weekday = '周日'
              break
            case 1:
              weekday = '周一'
              break
            case 2:
              weekday = '周二'
              break
            case 3:
              weekday = '周三'
              break
            case 4:
              weekday = '周四'
              break
            case 5:
              weekday = '周五'
              break
            case 6:
              weekday = '周六'
              break
            default:
              break
          }
          var isDisabled = !(schedule.leftNum > 0)
          var btnText = schedule.leftNum > 0 ? '余号 ' + schedule.leftNum + ' ¥' + schedule.registerFee : '已约满'
          var btnStyle = schedule.leftNum > 0 ? {backgroundColor: '#3CA0FF', color: 'white', textAlign: 'center', width: 85, height: 42} : {display: 'block', backgroundColor: '#dddddd', color: 'white', textAlign: 'center', width: 85, height: 42}
          return (
            <div style={{fontSize: 15, margin: 5, marginLeft: 10, color: '#505050', display: 'flex'}} key={schedule.id}>
              <div style={{marginRight: 5}}>{schedule.visitDate}</div>
              <div style={{marginRight: 5}}>{weekday}</div>
              <div style={{marginRight: 5}}>{schedule.amPm === 'a' ? '上午' : '下午'}</div>
              <button style={btnStyle} disabled={isDisabled} onClick={() => { goDetail(schedule) }}>{btnText}</button>
            </div>
          )
        })
      }
      <style jsx>{`
        .descriptionView {
          flexDirection: column;
          margin-top: 10;
        }
      `}</style>
    </div>
  )
}
export default DoctorScheduleList
