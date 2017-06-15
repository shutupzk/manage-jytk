import Link from 'next/link'
import {hosApmHomeIcon} from '../../../static/icons/svgIcon'

const Navigation = () => (
  <div className='footer'>
    <section>
      <Link href='/' prefetch>
        <dl>
          <dt></dt>
          <dd>首页</dd>
        </dl>
      </Link>
      <Link href='/appointment/appointment_list' prefetch>
        <dl>
          <dt></dt>
          <dd>挂号订单</dd>
        </dl>
      </Link>
      <Link href='/profile' prefetch>
        <dl>
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
      .tabBarIcon1Cur{
        background-position: -31px -32px;
      }
      .tabBarIcon1Cur{
        background-position: -33px -32px;
      }
      .tabBarIcon1Cur{
        background-position: -31px -32px;
      }
    `}</style>
  </div>
)

export default Navigation
