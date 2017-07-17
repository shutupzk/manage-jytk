import {theme} from 'components'
/**
 * 荣誉信息
 */
function DoctorAwards (props) {
  let doc = props.doctor
  return (
    <div className='awardsView'>
      <div className='titleText'>荣誉信息</div>
      <div className='contentText'>{doc.description || '无'}</div>
      <style jsx>{`
        .awardsView {
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

export default DoctorAwards
