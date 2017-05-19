import Link from 'next/link'
import { CardWhite } from '../../../components'
import {hosApmHomeIcon, patientPayHomeIcon, selfExamineHomeIcon, reportHomeIcon, inHosHomeIcon} from '../../../static/icons/svgIcon'

export default () => (
  <div>
    <img src='../../../static/icons/banner3.png' />
    <CardWhite classChild='nav'>
      <section className='navLeft'>
        <h3>预约挂号</h3>
        <p>预约挂号</p>
        <svg className='hosapmIcon' viewBox='62 541 146 131' version='1.1' xmlns="http://www.w3.org/2000/svg">{hosApmHomeIcon}</svg>
      </section>
      <section className="navRight">
        <article>
          <svg className='patientPayIcon' viewBox="48 -1 78 59" version="1.1" xmlns="http://www.w3.org/2000/svg">{patientPayHomeIcon}</svg>
          <h3>门诊缴费</h3>
          <p>在线缴费不排队</p>
        </article>
        <article>
          <svg className='selfExamineIcon' viewBox="39 -4 72 73" version="1.1" xmlns="http://www.w3.org/2000/svg">{selfExamineHomeIcon}</svg>
          <h3>疾病自查</h3>
          <p>智能引导就诊</p>
        </article>
      </section>
      <section className="navRight">
        <article>
          <svg className='reportIcon' viewBox="600 381 62 57" version="1.1" xmlns="http://www.w3.org/2000/svg">{reportHomeIcon}</svg>
          <h3>查询报告</h3>
          <p>在线查看检验报告</p>
        </article>
        <article>
          <svg className='inHosIcon' viewBox="600 594 62 55" version="1.1" xmlns="http://www.w3.org/2000/svg">{inHosHomeIcon}</svg>
          <h3>住院跟踪</h3>
          <p>查询住院信息</p>
        </article>
      </section>
    </CardWhite>
    <div className='container'>
      <div style={{height: '100px', width: '100%'}}>
        <Link href='/hospital'>医院中心</Link>
      </div>
      <div>
        <h3>健康咨询</h3>
      </div>
    </div>
    <style jsx global>{`
      .nav{
        display: -webkit-box;
        text-align: center;
      }
      .nav h3{
        color: #505050;
        font-size: .16rem;
        font-weight: normal;
        margin: .06rem 0 0;
      }
      .nav p{
        color: #b4b4b4;
        font-size: .12rem;
        margin: 0;
      }

      .navLeft{
        width: 1.3rem;
        padding-top: .44rem;
      }
      .hosapmIcon{
        width: .72rem;
        height: .64rem;
        display:block;
        margin: .18rem auto 0;
      }

      .navRight{
        -webkit-box-flex: 0.5;
        border-left: 1px solid #d8d8d8;
      }
      .navRight article{
        height: 1.05rem;
      }
      .navRight h3{
      }
      .navRight svg{
        display:block;
        margin: .15rem auto 0;
      }
      .navRight article:nth-of-type(1) {
        border-bottom: 1px solid #d8d8d8;
      }
      .patientPayIcon{
        width: .38rem;
        height: .3rem;
      }
      .selfExamineIcon{
        width: .32rem;
        height: .32rem;
      }
      .reportIcon{
        width: .3rem;
        height: .3rem;
      }
      .inHosIcon{
        width: .32rem;
        height: .32rem;
      }

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
