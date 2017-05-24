/**
 * 医生介绍
 */
function Major (props) {
  let doc = props.doctor
  return (
    <div className='majorView'>
      <div className='titleText'>擅长领域</div>
      <div className='contentText'>{doc.major || '功能性胃肠病、胃食管反流病等消化疾病。'}</div>
      <style jsx>{`
        .majorView {
          flex: 7px;
          background-color: white;
        }
        .titleText {
          font-size: 14px;
          margin: 5px;
          margin-left: 10px;
          color: #B4B4B4;
        }
        .contentText {
          font-size: 14px;
          margin: 5px;
          margin-left: 10px;
          color: #505050;
        }
      `}</style>
    </div>
  )
}
export default Major
