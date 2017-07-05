import {theme} from 'components'
/**
 * 医生简介
 */
function DoctorDescription (props) {
  let doc = props.doctor
  return (
    <div className='descriptionView'>
      <div className='titleText'>医生简介</div>
      <div className='contentText'>{doc.description || '1995年毕业于白求恩医科大学临床医学系获学士学位，2009年毕业于北京大学医学部研究生院获硕士学位，临床工作多年，积累了较多临床经验，在核心期刊发表多篇论文。'}</div>
      <style jsx>{`
        .descriptionView {
          padding: ${theme.lrmargin} 0 0;
        }
        .titleText {
          font-size: ${theme.nfontsize};
          color: ${theme.nfontcolor};
          line-height: .2rem;
        }
        .contentText {
          font-size: ${theme.fontsize};
          line-height: .26rem;
          color: ${theme.mainfontcolor};
        }
      `}</style>
    </div>
  )
}

export default DoctorDescription
