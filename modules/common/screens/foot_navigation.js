import Link from 'next/link'
import {HOME_PAGE} from 'config'
import {theme} from 'components'

const Navigation = (props) => {
  const url = props.url
  const data = props.data
  return (
    <ul>
      {
        data && data.map((item) => {
          return (
            <li className={url === item.navigateName ? 'leftLiCur' : ''}
              key={item.title}>
              <Link href={item.navigateName}><a style={{color: item.color}}>{item.title}</a></Link>
            </li>
          )
        })
      }
      <style jsx>{`
        li{
          line-height: .46rem;
          font-size: .16rem;
          cursor: pointer;
        }
        li.leftLiCur{
          background: #1A3979;
        }
        li.leftLiCur a{
          color: #fff !important;
        }
      `}</style>
    </ul>
  )
}

export default Navigation
