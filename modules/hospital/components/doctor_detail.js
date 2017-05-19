function renderTitleCard (doc) {
  return (
    <div style={styles.containerStyle}>
      <div style={{float: 'left', width: '22%'}}><img style={styles.avatarStyle} src='/static/icons/doctor_head.png'/></div>
      <div style={{hight: 60, width: '78%', float: 'right'}}>
        <div style={{float: 'left', width: '70%', hight: 60}}>
          <div style={[styles.nameText, {color: '#505050'}]}>{doc.doctorName}</div>
          <div style={[styles.titleText, {color: '#B4B4B4'}]}>主任医师</div>
        </div>
        <div style={{float: 'right', width: '30%', hight: 60}}>
          <div style={styles.collectionView}>
            {/*<Icon
              size={22}
              name='star'
              type='font-awesome'
              color='#E0E0E0' />*/}
            <div style={{color: '#505050'}}>
              收藏
            </div>
          </div>
        </div>
      </div>
      <div className='.clearfix'>&nbsp;</div>
    </div>
    )
  }
/**
 * 医生介绍
 */
function renderMajor (doc) {
  return (
    <div style={styles.majorView}>
      <div style={{fontSize: 14, margin: 5, marginLeft: 10, color: '#B4B4B4'}}>擅长领域</div>
      <div style={{fontSize: 15, margin: 5, marginLeft: 10, color: '#505050'}}>{doc.major || '功能性胃肠病、胃食管反流病等消化疾病。'}</div>
    </div>
  )
}

/**
 * 出诊时间
 */
function renderSchedule (doc) {
  return (
    <div style={styles.descriptionView}>
      <div style={{fontSize: 14, margin: 5, marginLeft: 10, color: '#B4B4B4'}}>出诊时间</div>
      <div style={{fontSize: 15, margin: 5, marginLeft: 10, color: '#505050'}}>
        <li>2017-5-23 &nbsp;周二 &nbsp;上午 &nbsp;<span style={{backgroundColor: '#3CA0FF', color: 'white'}}>余号 8 ¥100</span></li>
      </div>
    </div>
  )
}

/**
 * 医生简介
 */
function renderDescription (doc) {
  return (
    <div style={styles.descriptionView}>
      <div style={{fontSize: 14, margin: 5, marginLeft: 10, color: '#B4B4B4'}}>医生简介</div>
      <div style={{fontSize: 15, margin: 5, marginLeft: 10, color: '#505050'}}>{doc.description || '1995年毕业于白求恩医科大学临床医学系获学士学位，2009年毕业于北京大学医学部研究生院获硕士学位，临床工作多年，积累了较多临床经验，在核心期刊发表多篇论文。'}</div>
    </div>
  )
}
/**
 * 荣誉信息
 */
function renderAwards (doc) {
  return (
    <div style={styles.descriptionView}>
      <div style={{fontSize: 14, margin: 5, marginLeft: 10, color: '#B4B4B4'}}>荣誉信息</div>
      <div style={{fontSize: 15, margin: 5, marginLeft: 10, color: '#505050'}}>{doc.description || '1995年毕业于白求恩医科大学临床医学系获学士学位，2009年毕业于北京大学医学部研究生院获硕士学位，临床工作多年，积累了较多临床经验，在核心期刊发表多篇论文。'}</div>
    </div>
  )
}
// button: 我要评价
function renderBottomButton (doc) {
  return (
    <div style={{position: 'absolute', bottom: '15px', width: '90%', height: '40px'}}>
      <button style={{width: '100%', display: 'block', backgroundColor: '#3CA0FF', height: '40px', borderRadius: '10px', fontSize: 16}}>我要评价</button>
    </div>
  )
}

export default (props) => {
  let doctor = props.doctor
  return (
    <div className='container' style={styles.container}>
      {
        renderTitleCard(doctor)
      }
      {
        renderMajor(doctor)
      }
      {
        renderSchedule(doctor)
      }
      {
        renderDescription(doctor)
      }
      {
        renderAwards(doctor)
      }
      {
        renderBottomButton(doctor)
      }
      <style jsx>{`
        
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    flex: 7,
    backgroundColor: 'white'
  },
  containerStyle: {
    borderBottomWidth: 0
  },
  avatarStyle: {
    borderRadius: 0,
    height: 60,
    width: 60
  },
  subView: {
    height: 60,
    flexDirection: 'row'
  },
  subtitleView: {
    height: 60,
    flex: 2
  },
  subCollectionView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  collectionView: {
    flexDirection: 'column'
  },
  nameText: {
    margin: 5,
    marginTop: 10,
    alignItems: 'center',
    fontSize: 18
  },
  titleText: {
    margin: 5,
    alignItems: 'center',
    fontSize: 13
  },
  majorView: {
    height: 60,
    flexDirection: 'column'
  },
  descriptionView: {
    flexDirection: 'column',
    marginTop: 10
  }
}
