import Link from 'next/link'

const Navigation = () => (
  <div className='footer'>
    <div>
      <div style={{float: 'left', width: '33.3%', textAlign: 'center'}}>
        <Link href='/' prefetch>
          <span>首页</span>
        </Link>
      </div>
      <div style={{float: 'left', width: '33.3%', textAlign: 'center'}}>
        <Link href='/orders' prefetch>
          <span>挂号订单</span>
        </Link>
      </div>
      <div style={{float: 'left', width: '33.3%', textAlign: 'center'}}>
        <Link href='/profile' prefetch>
          <span>我的</span>
        </Link>
      </div>
    </div>
    <div className='clearfix'>&nbsp;</div>
    <style jsx>{`
      .footer {
        width: 100%;
        {/*text-align: center*/}
        height: 60px;
        position: fixed;
        bottom: 20px;
        left: 0px;
        {/*&:first-child {
          float: left;
        }*/}
      }
      .col-md-4 {
          width: 30%;
          float: left;
        }
      
      .clearfix {
        clear: both
      }
    `}</style>
  </div>
)

export default Navigation
