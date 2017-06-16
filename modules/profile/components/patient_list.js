import { ages } from '../../../utils'

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
    <div style={{margin: 10}}>
      {array.map((item, i) => (
        Item(item, i, gotoDetail)
      ))}
    </div>
  )
}

const Item = (item, i, gotoDetail) => {
  return (
    <div
      style={{marginBottom: '10px', backgroundColor: '#ffffff'}}
      key={item.id}
      onClick={() => { gotoDetail(item.id) }}>
      <div className={'itemView'} >
        <div className={'itemTop'}>
          <span className={'nameText'}>{item.name}</span>
          {ownText(item.relationship)}
          {sexIcon(item)}
          <span className={'smallText'}>{`${ages(item.birthday)}岁`}</span>
          <span style={{float: 'right', marginRight: 10}}>{item.default ? '默认' : ''}</span>
        </div>
        <div className={'itemMiddle'}>
          {/* <Icon name='address-card-o' type='font-awesome' size={12} /> */}
          <img style={{size: 12, marginRight: 10}} src='/static/icons/idCard_icon.png' />
          <span className={'smallText'}>{item.certificateNo}</span>
        </div>
        <div className={'itemMiddle'}>
          {/* <Icon name='phone' type='simple-line-icon' size={12} /> */}
          <img style={{size: 12, marginRight: 10}} src='/static/icons/phoneNum_icon.png' />
          <span className={'smallText'} >{item.phone}</span>
        </div>
      </div>
      <style jsx>{`
        .itemView {
          borderTopWidth: 0,
          height: 100px;
          padding: 10px 15px;
        }
        .itemTop {
          flex-wrap: nowrap；
          flex-direction: row;
          align-items: baseline;
          margin-bottom: 2px;
        }
        .nameText {
          font-size: 18px;
          margin-right: 10px;
        }
        .smallText {
          margin-left: 10px
          font-size: 14px;
          color: #797979;
        }
        .itemMiddle {
          margin-top: 9px;
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
  return <img style={{size: 15, color: color}} src='/static/icons/sex_male.png' /> // <Icon name={name} type='font-awesome' size={15} color={color} />
}

const ownText = (i) => {
  if (i !== '01') return null
  return <span style={{fontSize: 14, color: '#B4B4B4'}}>{`（本人）`}</span>
}

export default patientList
