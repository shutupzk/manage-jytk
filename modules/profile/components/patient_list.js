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
    <div style={styles.listView}>
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
      <div style={styles.itemView} >
        <div style={styles.itemTop}>
          <span style={styles.nameText}>{item.name}</span>
          {ownText(item.relationship)}
          {sexIcon(item)}
          <span style={styles.smallText}>{`${ages(item.birthday)}岁`}</span>
          <span style={{float: 'right'}}>{item.default ? '默认' : ''}</span>
        </div>
        <div style={styles.itemMiddle}>
          {/* <Icon name='address-card-o' type='font-awesome' size={12} /> */}
          <img style={{size: 12}} src='/static/icons/idCard_icon.png' />
          <span style={styles.smallText}>{item.certificateNo}</span>
        </div>
        <div style={styles.itemMiddle}>
          {/* <Icon name='phone' type='simple-line-icon' size={12} /> */}
          <img style={{size: 12}} src='/static/icons/phoneNum_icon.png' />
          <span style={styles.smallText} >{item.phone}</span>
        </div>
      </div>
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
  return <span style={styles.ownText}>{`（本人）`}</span>
}

const styles = {
  container: {
    flex: 1
  },
  listView: {
    backgroundColor: '#eeeeee',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15
  },
  itemView: {
    borderTopWidth: 0,
    height: 100,
    // borderBottom: '1px solid #eeeeee',
    padding: '10px 15px'
  },
  itemTop: {
    borderTopWidth: 0,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2
  },
  nameText: {
    fontSize: 18,
    marginRight: 10
  },
  ownText: {
    fontSize: 14,
    color: '#B4B4B4'
  },
  smallText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#797979'
  },
  itemMiddle: {
    marginTop: 9,
    borderTopWidth: 0,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'baseline'
  }
}

export default patientList
