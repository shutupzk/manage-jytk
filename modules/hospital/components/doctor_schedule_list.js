import _ from 'lodash'
import {theme} from 'components'
/**
 * 出诊时间
 */
function DoctorScheduleList (props) {
  let {schedules, goDetail, departmentId, doctor} = props
  let scheduleArr = []
  _.mapValues(schedules, (schedule) => {
    if (schedule.doctorId === doctor.id && schedule.departmentId === departmentId) {
      scheduleArr.push(schedule)
    }
  })
  return (
    <div className='descriptionView'>
      <div className='titleText'>出诊时间</div>
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
          var btnText = schedule.leftNum > 0 ? <article onClick={() => { goDetail(schedule) }}><span>余号 {schedule.leftNum}</span><i>¥{schedule.registerFee}</i></article> : <article className='disableBtn' onClick={() => { goDetail(schedule) }}>已约满</article>
          return (
            <div className='scheduleList' key={schedule.id}>
              <section className='left'>
                <span>&nbsp;&nbsp;{schedule.visitDate}&nbsp;</span>
                <span>{weekday}&nbsp;</span>
                <span>{schedule.amPm === 'a' ? '上午' : '下午'}</span>
              </section>
              {btnText}
              <div className='clearfix'></div>
            </div>
          )
        })
      }
      <style jsx>{`
        .descriptionView {
          padding: ${theme.lrmargin} 0 0;
        }
        .titleText {
          font-size: ${theme.nfontsize};
          color: ${theme.nfontcolor};
          line-height: .2rem;
        }
        .scheduleList{
          background: #f2f2f2;
          border-radius: 6px;
          color: ${theme.mainfontcolor};
          justify-content: space-between;
          margin: ${theme.tbmargin} 0;
        }
        .scheduleList section{
          {/*padding: 0 ${theme.tbmargin};*/}
          line-height: .36rem;
          width: 70%;
        }
        .scheduleList article{
          margin: 0;
          border: none;
          background: ${theme.maincolor};
          color: #fff;
          text-align: center;
          font-size: .14rem;
          border-radius: 0 6px 6px 0;
          float: right;
          width: 30%;
        }
        .scheduleList article i{
          display: block;
          font-style: normal;
          color: #F39800;
          font-size: .12rem;
        }
        .scheduleList article.disableBtn{
          background: ${theme.bordercolor};
          {/*color: */}
          line-height: .36rem;
        }
      `}</style>
    </div>
  )
}
export default DoctorScheduleList
