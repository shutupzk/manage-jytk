import { ages } from '../../../utils'
import {theme, CardWhite} from 'components'


const patientList = (props) => {
  const patients = props.patients
  const gotoDetail = props.gotoDetail
  let array = []
  for (let i in patients) {
    if (patients[i] && patients[i].id) {
      array.push(patients[i])
    }
  }
  return (
    <div>
      {array.map((item, i) => (
        Item(item, i, gotoDetail)
      ))}
    </div>
  )
}

const Item = (item, i, gotoDetail) => {
  return (
    <div
      className='patientListItem'
      key={item.id}
      onClick={() => { gotoDetail(item.id) }}>
      <div>
        <div className={'itemTop flex tb-flex'}>
          <strong>{item.name}</strong>
          {ownText(item.relationship)}
          {sexIcon(item)}
          <span className={'smallText'}>{`${ages(item.birthday)}岁`}</span>
        </div>
        <div className={'itemMiddle cardItem flex tb-flex'}>
          {/* <Icon name='address-card-o' type='font-awesome' size={12} /> */}
          <article className={'flex tb-flex lr-flex'}><img src='/static/icons/idCard_icon.png' /></article>
          <span className={'smallText'}>{item.certificateNo}</span>
        </div>
        <div className={'itemMiddle flex tb-flex'}>
          {/* <Icon name='phone' type='simple-line-icon' size={12} /> */}
          <article className={'flex tb-flex lr-flex'}><img src='/static/icons/phoneNum_icon.png' /></article>
          <span className={'smallText'} >{item.phone}</span>
        </div>
        <p className='defaultIcon'><span>{item.default ? '默认' : ''}</span>{item.default ? <i className='bgIcon' /> : ''}</p>
      </div>
      <style jsx>{`
        .patientListItem{
          margin: ${theme.lrmargin};
          background: #FFFFFF;
          box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.10);
          border-radius: 4px;
          padding: ${theme.lrmargin} 0 ${theme.lrmargin} .2rem;
          position: relative;
        }
        .defaultIcon{
          {/*color: #fff;*/}
          {/*transform: rotate(-45deg);*/}
          position: absolute;
          right: 0;
          bottom: 0;
        }
        .defaultIcon span{
          position: absolute;
          right: 4px;
          bottom: 5px;
          z-index: 10;
          color: #fff;
          transform: rotate(-45deg);
          width: 28px;
        }
        .bgIcon{
          content: '';
          display: block;
          width: 0;
          height: 0;
          border-left: .36rem solid transparent;
          border-right: .36rem solid transparent;
          border-top: .36rem solid ${theme.maincolor};
          position: absolute;
          right: -.23rem;
          bottom: -.06rem;
          transform: rotate(-45deg);
        }
        .itemTop {
        }
        .itemTop strong{
          font-size: .17rem;
          padding-right: ${theme.tbmargin};
          color: ${theme.mainfontcolor};
        }
        .smallText {
          color: ${theme.fontcolor};
          font-size: .14rem;
          padding-left: ${theme.tbmargin};
        }
        .itemMiddle article{
          width: .2rem;
          text-align: center;
        }
        .itemMiddle img{
          height: .14rem;
        }
        .itemMiddle.cardItem{
          padding: .1rem 0 .06rem;
        }
        .itemMiddle.cardItem img{
          height: .12rem;
        }
      `}</style>
    </div>
  )
}

const sexIcon = (item) => {
  let color = '#FF7C7C'
  if (item.sex === '0') {
    color = '#3CA0FF'
  }
  return <img src='/static/icons/sex_male.png' style={{width: 16, color: color}} /> // <Icon name={name} type='font-awesome' size={15} color={color} />
}

const ownText = (i) => {
  const fontSize = theme.nfontsize;
  const fontColor = theme.nfontcolor;
  if (i !== '01') return null
  return <span style={{fontSize: fontSize, color: fontColor, paddingRight: '.06rem'}}>{`(本人)`}</span>
}

export default patientList
