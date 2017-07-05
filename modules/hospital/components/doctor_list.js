import { replaceStr } from '../../../utils'
import {NoDataCard, Loading, theme} from 'components'

export default (props) => {
  let doctors = props.doctors
  return (
    <ul style={{padding: 0}}>
      {
        doctors.length > 0 ? doctors.map((doc) => {
          let isMyDoc = doc.isMyDoctor
          const description = '擅长领域: ' + doc.description
          return (
            <li key={doc.id} style={{marginBottom: 10, padding: theme.lrmargin, backgroundColor: '#fff', height: '60px', position: 'relative'}}
             onClick={() => { props.toUrl(doc.id) }}
             className='flex'>
              <img width='60' height='60' src='/static/icons/doctor_head.png' style={{marginRight: theme.lrmargin}} />
              <div>
                <h3 style={{margin: 0, fontSize: 16, color: theme.mainfontcolor}}>姓名：{doc.doctorName}</h3>
                <div style={{fontSize: theme.nfontsize, color: theme.fontcolor, lineHeight: '24px'}}>{doc.deptName}|{doc.title}</div>
                <div className='textoverflow1' style={{fontSize: theme.nfontsize, color: theme.fontcolor}}>{replaceStr(description, 24, description.length, '...')}</div>
              </div>
              {
                isMyDoc ? <img src='/static/icons/recommend.png' style={{width: 16, height: 25, position: 'absolute', right: 15, top: 0}} /> : ''
              }
              <div className='clearfix'>&nbsp;</div>
            </li>
          )
        }) : <NoDataCard tip='您还没有收藏医生哦' />
      }
    </ul>
  )
}