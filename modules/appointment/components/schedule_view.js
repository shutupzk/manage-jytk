function scheduleView (props, schedules, departmentId, doctorId) {
  const array = getScheduleList(schedules, departmentId, doctorId)
  return (
    <div>
      <div style={{fontSize: 14, margin: 5, marginLeft: 10, color: '#B4B4B4'}}>出诊时间</div>
      {
        array.map((schedule, i) => scheduleItem(props, schedule, i))
      }
    </div>
  )
}
function scheduleItem (props, schedule, i) {
  return (
    <div style={styles.itemView}>
      <div style={styles.itemLeftView}>
        <span style={styles.scheduleLeftText}>{schedule.visitDate}</span>
        <span style={styles.scheduleLeftText}>周四</span>
        <span style={styles.scheduleLeftText}>{schedule.amPm}</span>
      </div>
      <div style={styles.itemRightView}>
        <span style={styles.scheduleTextLeft}>余号 {schedule.leftNum}</span>
      </div>
    </div>
  )
}
function getScheduleList (schedules, departmentId, doctorId) {
  let array = []
  for (let key in schedules) {
    if (schedules[key].doctorId === doctorId && schedules[key].departmentId === departmentId) {
      array.push(Object.assign({}, schedules[key], {key}))
    }
  }
  return array
}
export default (props) => {
  return (
    <div>
      {scheduleView()}
    </div>
  )
}
const styles = {
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  scheduleLeftText: {
    height: 30,
    alignItems: 'center',
    padding: 5,
    color: '#505050'
  },
  itemView: {
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    height: 30,
    flexDirection: 'row'
  },
  itemLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3
  },
  itemRightView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3CA0FF',
    width: 80,
    height: 30,
    flex: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  }
}
