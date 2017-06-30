import Link from 'next/link'
import {hosApmHomeIcon} from '../../../static/icons/svgIcon'

const Navigation = (props) => {
  const url = (props.url && props.url.pathname) || '/';
  console.log('navigation', props);
  console.log('---cur url', url);
  return (
    <div className='footer'>
      <section>
        <Link href='/' prefetch>
          <dl className={url === '/' ? 'tabBarIcon1Cur' : ''}>
            <dt></dt>
            <dd>首页</dd>
          </dl>
        </Link>
        <Link href='/appointment/appointment_list' prefetch>
          <dl className={url === '/appointment/appointment_list' ? 'tabBarIcon2Cur' : ''}>
            <dt></dt>
            <dd>挂号订单</dd>
          </dl>
        </Link>
        <Link href='/profile' prefetch>
          <dl className={url === '/profile' ? 'tabBarIcon3Cur' : ''}>
            <dt></dt>
            <dd>我的</dd>
          </dl>
        </Link>
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
          background: url('/static/icons/icon.png');
          width: 24px;
          height: 26px;
          background-position: 2px 4px;
          background-size: 260px;
          display: inline-block;
        }
        .footer dl:nth-of-type(2) dt{
          background-position: 4px -32px;
        }
        .footer dl:nth-of-type(3) dt{
          background-position: 2px -68px;
        }
        .footer dl.tabBarIcon1Cur{
          color: #257BDE;
        }
        .footer dl.tabBarIcon1Cur dt{
          background-position: -32px 4px;
        }
        .footer dl.tabBarIcon2Cur{
          color: #257BDE;
        }
        .footer dl.tabBarIcon2Cur dt{
          background-position: -33px -32px;
        }
        .footer dl.tabBarIcon3Cur{
          color: #257BDE;
        }
        .footer dl.tabBarIcon3Cur dt{
          background-position: -31px -32px;
        }
      `}</style>
    </div>
  )
}

export default Navigation
