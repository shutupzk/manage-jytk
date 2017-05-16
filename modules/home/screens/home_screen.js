import Link from 'next/link'

export default () => (
  <div>
    <div>
      <img src='../../../static/icons/banner3.png' />
    </div>
    <div className='container'>
      <div style={{height: '100px', width: '100%'}}>
        <div style={{width: '50%', float: 'left', height: '100%'}}><Link><a>预约挂号</a></Link></div>
        <div style={{width: '50%', float: 'left', height: '100%'}}>
          <div style={{width: '50%', float: 'left', height: '100%'}}>
            <Link><a>门诊缴费</a></Link>
            <Link><a>疾病自查</a></Link>
          </div>
          <div style={{width: '50%', float: 'left', height: '100%'}}>
            <Link><a>查询报告</a></Link>
            <Link><a>住院跟踪</a></Link>
          </div>
          <div className='clearfix'>&nbsp;</div>
        </div>
        <div className='clearfix'>&nbsp;</div>
      </div>
      <div style={{height: '100px', width: '100%'}}>
        <Link href='/hospital'>医院中心</Link>
      </div>
      <div>
        <h3>健康咨询</h3>
      </div>
    </div>
    <style jsx>{`
      .container {
        flex: 1;
        flexDirection: column;
      }
      img {
        height: 180;
        width: 100%;
        resizeMode: stretch;
      }
      .ScrollDiv {
            height:'';
            overflow-y:auto;
          }
    `}</style>
  </div>
)
