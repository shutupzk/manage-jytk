import {theme} from 'components'

function TitleCard (props) {
  const doc = props.doctor
  const isMyDoc = props.isMyDoc
  const toMyDoctor = props.toMyDoctor
  return (
    <div className='cardContainer flex' style={{display: '-webkit-box', justifyContent: 'space-between'}}>
      <img src='/static/icons/doctor_head.png' />
      <div className='rightCard flex tb-flex' style={{justifyContent: 'space-between'}}>
        <div>
          <div style={{color: theme.mainfontcolor, fontWeight: '500', fontSize: theme.fontsize}}>{doc.doctorName}</div>
          <div style={{color: theme.fontcolor, fontSize: theme.nfontsize, marginTop: '.04rem'}}>{doc.title || '主任医师'}</div>
        </div>
        <div onClick={() => toMyDoctor()}>
          {
            isMyDoc ?
              <dl style={{alignItems: 'center'}}>
                <img src={'/static/icons/collected.png'} />
                <dd>已收藏</dd>
              </dl>
            :
              <dl style={{alignItems: 'center'}}>
                <img src={'/static/icons/collect.png'} />
                <dd>收藏</dd>
              </dl>
          }
        </div>
      </div>
      <style jsx>{`
        .cardContainer {
          flex: 7px;
          background-color: white;
        }
        .cardContainer img{
          height: .46rem;
          margin-right: 10px;
        }
        .rightCard {
          -webkit-box-flex: 1
        }
        .rightCard dl {
          font-size: 12px;
          color: ${theme.fontcolor};
          text-align: center;
        }
        .rightCard dl img{
          height: 20px;
          margin-right: 0;
          display: inline-block;
        }
      `}</style>
    </div>
  )
}

export default TitleCard
