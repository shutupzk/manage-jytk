/**
 * 荣誉信息
 */
function DoctorAwards (props) {
  let doc = props.doctor
  return (
    <div className='awardsView'>
      <div className='titleText'>荣誉信息</div>
      <div className='contentText'>{doc.description || '1995年毕业于白求恩医科大学临床医学系获学士学位，2009年毕业于北京大学医学部研究生院获硕士学位，临床工作多年，积累了较多临床经验，在核心期刊发表多篇论文。'}</div>
      <style jsx>{`
        .awardsView {
          flex-direction: column;
          margin-top: 10
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

export default DoctorAwards
