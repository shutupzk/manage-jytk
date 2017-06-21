function TitleCard (props) {
  const doc = props.doctor
  const isMyDoc = props.isMyDoc
  const toMyDoctor = props.toMyDoctor
  return (
    <div className='cardContainer'>
      <div style={{float: 'left', width: '25%'}}><img src='/static/icons/doctor_head.png' /></div>
      <div style={{hight: 60, width: '75%', float: 'right'}}>
        <div style={{float: 'left', width: '70%', height: 60}}>
          <div>{doc.doctorName}</div>
          <div>{doc.title || '主任医师'}</div>
        </div>
        <div style={{float: 'right', width: '20%', height: 60, color: '#505050', padding: 5}} onClick={() => toMyDoctor()}>
          {
            isMyDoc ? <div style={{alignItems: 'center'}}><li className='light' ><a /></li><div>已收藏</div></div> : <div><li><a /></li><div>收藏</div></div>
          }
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
        li {
          {/*float: left;*/}
          list-style: none;
          width: 27px;
          height: 27px;
          background: url(/static/icons/stars.gif)
        }
        li a {
          display: block;
          width: 100%;
          padding-top: 27px;
          overflow: hidden;
        }
        li.light {
          background-position: 0 -29px;
        }
      `}</style>
    </div>
  )
}

export default TitleCard
