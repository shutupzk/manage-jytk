import Link from 'next/link'
export default (props) => {
  let doctors = props.doctors
  return (
    <ul style={{padding: 0}}>
      {
        doctors.length > 0 ? doctors.map((doc) => {
          return (
            <li key={doc.id} style={{marginBottom: 10, padding: 10, backgroundColor: '#ffffff'}}>
              <div onClick={() => { props.toUrl(doc.id) }}>
                <a>
                  <div style={{float: 'left', width: '22%'}}>
                    <img width='60' height='60' src='/static/icons/doctor_head.png' />
                  </div>
                  <div style={{width: '78%'}}>
                    <h3 style={{margin: 0}}>姓名：{doc.doctorName}</h3>
                    <div>{doc.major}|主治医师</div>
                    <div>擅长领域{doc.description}</div>
                  </div>
                  <div className='clearfix'>&nbsp;</div>
                </a>
              </div>
            </li>
          )
        }) : <div>暂时还没有医生</div>
      }
    </ul>
  )
}