import {theme} from 'components'
/**
 * 医生介绍
 */
function Major (props) {
  let doc = props.doctor
  return (
    <div className='majorView'>
      <div className='titleText'>擅长领域</div>
      <div className='contentText'>{doc.major || '暂无'}</div>
      <style jsx>{`
        .majorView {
          padding: ${theme.lrmargin} 0 0;
        }
        .titleText {
          font-size: ${theme.nfontsize};
          color: ${theme.fontcolor};
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
export default Major
