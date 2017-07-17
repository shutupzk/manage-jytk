import {theme} from 'components'
/**
 * 医生简介
 */
function DoctorDescription (props) {
  let doc = props.doctor
  return (
    <div className='descriptionView'>
      <div className='titleText'>医生简介</div>
      <div className='contentText'>{doc.description || '暂无'}</div>
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
