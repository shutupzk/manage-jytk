import Link from 'next/link'
import {HOME_PAGE} from 'config'
import {theme} from 'components'

const Navigation = (props) => {
  const url = (props.url && props.url.pathname) || '/';
  console.log('navigation', props);
  console.log('---cur url', url);
  const dlWidth = (100 / HOME_PAGE.bottomLabel.length) + '%';
  return (
    <div className='footer'>
      <section>
        {
          HOME_PAGE.bottomLabel.map((label, iKey) => {
            console.log('----label.url', label.url)
            return (
              <Link href={label.url} key={iKey} prefetch>
                <dl style={{width: dlWidth}} className={url === label.url ? 'tabBarIconCur' : ''}>
                  <dt className='flex tb-flex lr-flex'><img style={label.imgStyle} src={url === label.url ? label.avatar + 'Cur.png' : label.avatar + '.png'} /></dt>
                  <dd>{label.title}</dd>
                </dl>
              </Link>
            )
          })
        }
        <div className='clearfix'>&nbsp;</div>
      </section>
      <style jsx>{`
        .footer {
          background: #fff;
          border-top: 1px solid #D8D8D8;
          color: #797979;
          font-size: .13rem;
          position: fixed;
          bottom: 0;
          width: 100%;
        }
        .footer section{

        }
        .footer dl{
          text-align: center;
          float: left;
          width: 33.3%;
          padding: 4px 0;
        }
        .footer dl dt{
          width: 30px;
          height: 30px;
          display: inline-block;
        }
        .footer dl dt img{
          width: 100%;
        }
        .footer dl.tabBarIconCur{
          color: ${theme.maincolor};
        }
      `}</style>
    </div>
  )
}

export default Navigation
