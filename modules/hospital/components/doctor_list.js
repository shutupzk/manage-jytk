export default (props) => {
  let doctors = props.doctors
  const userId = props.userId
  console.log(doctors)
  console.log(userId)
  return (
    <ul style={{padding: 0}}>
      {
        doctors.length > 0 ? doctors.map((doc) => {
          let isMyDoc = false
          console.log(doc.userIds.indexOf(userId))
          if (doc.userIds.indexOf(userId) > -1) {
            isMyDoc = true
          }
          return (
            <li key={doc.id} style={{marginBottom: 10, padding: 10, backgroundColor: '#ffffff'}}>
              <div style={{display: 'flex'}} onClick={() => { props.toUrl(doc.id) }}>
                <div style={{float: 'left', width: '22%'}}>
                  <img width='60' height='60' src='/static/icons/doctor_head.png' />
                </div>
                <div style={{width: '78%'}}>
                  <div style={{float: 'right', marginTop: -10, marginRight: 10}}>
                    {
                      isMyDoc ? <img src='/static/icons/recommend.png' style={{width: 16, height: 25}} /> : ''
                    }
                  </div>
                  <h3 style={{margin: 0}}>姓名：{doc.doctorName}</h3>
                  <div>{doc.major}|主治医师</div>
                  <div>擅长领域{doc.description}</div>
                </div>
                <div className='clearfix'>&nbsp;</div>
              </div>
            </li>
          )
        }) : <div>暂时还没有医生</div>
      }
    </ul>
  )
}