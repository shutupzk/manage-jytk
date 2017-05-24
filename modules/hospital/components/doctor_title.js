function TitleCard (props) {
  var doc = props.doctor
  return (
    <div className='cardContainer'>
      <div style={{float: 'left', width: '25%'}}><img src='/static/icons/doctor_head.png' /></div>
      <div style={{hight: 60, width: '75%', float: 'right'}}>
        <div style={{float: 'left', width: '70%', height: 60}}>
          <div>{doc.doctorName}</div>
          <div>主任医师</div>
        </div>
        <div style={{float: 'right', width: '30%', height: 60}}>
          <div>
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
      <style jsx>{`
        .cardContainer {
          flex: 7px;
          background-color: white;
        }
        img {
          border-radius: 0px;
          height: 60px;
          width: 60px;
        }
        .nameDiv {
          margin: 5px;
          marginTop: 10px;
          align-items: center;
          font-size: 18px;
          color: #505050;
        }
        .titleDiv {
          margin: 5px;
          align-items: center;
          font-size: 13px;
          color: #B4B4B4;
        }
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

export default TitleCard
