import React from 'react'
import { connect } from 'react-redux'
import { HospitalFunctionList } from '../components'
import { HOSPITAL_FUNCTION_LIST, HOSPITALINFO } from '../../../config'
import { List, theme } from '../../../components'
import { queryHospitals } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
import Router from 'next/router'

class HospitalScreen extends React.Component {
  compomentWillMount () {
    if (isEmptyObject(this.props.hospitals)) {
      this.props.queryHospitals(this.props.client)
    }
  }

  goNextpage (item) {
    let href = '/hospital/' + item.navigateName
    if (item.params.toScreenKey) {
      href = '/hospital/' + item.navigateName + '?toScreenKey=' + item.params.toScreenKey
    }
    Router.push(href)
  }


  render () {
    const topItem = HOSPITAL_FUNCTION_LIST.slice(0, 4);
    const bottomItem = HOSPITAL_FUNCTION_LIST.slice(4, 10);
    return (
      <div>
        <div style={{textAlign: 'center', background: theme.maincolor, padding: '.35rem 0'}}>
          <img style={{height: '.35rem'}} src={HOSPITALINFO.hospital_image} />
        </div>
        <ul className='hospitalItem'>
          {
            topItem && topItem.map((item, iKey) => {
              return (
                <li className='left' key={iKey} onClick={() => this.goNextpage(item)}>
                  <section className=''>
                    <article className='left itemimg'><img style={{width: item.width}} src={item.avatar} /></article>
                    <dl className='left'>
                      <dt>{item.title}</dt>
                      <dd>{item.subTitle}</dd>
                    </dl>
                    <div className='clearfix'>&nbsp;</div>
                  </section>
                </li>
              )
            })
          }
          <div className='clearfix'>&nbsp;</div>
          {/*<List component={HospitalFunctionList} items={HOSPITAL_FUNCTION_LIST} />*/}
        </ul>
        <ul className='hospitalItem'>
          {
            bottomItem && bottomItem.map((item, iKey) => {
              return (
                <li className='left' key={iKey} onClick={() => this.goNextpage(item)}>
                  <section className=''>
                    <article className='left itemimg'><img style={{width: item.width}} src={item.avatar} /></article>
                    <dl className='left'>
                      <dt>{item.title}</dt>
                      <dd>{item.subTitle}</dd>
                    </dl>
                    <div className='clearfix'>&nbsp;</div>
                  </section>
                </li>
              )
            })
          }
          {bottomItem.length%2 ? <li className='left'></li> : ''}
          <div className='clearfix'>&nbsp;</div>
        </ul>
        <style jsx>
          {`
            .hospitalItem{
              background: #fff;
              margin-top: ${theme.tbmargin};
            }
            .hospitalItem li{
              height: 90px;
              width: 50%;
              border-top: 1px solid #e6e6e6;
            }
            .hospitalItem li section{
              height: 50px;
              padding: 20px 0 20px 14%;
            }
            .itemimg{
              width: .24rem;
              text-align: center;
              padding-top: .02rem;
              padding-right: .06rem;
            }
            .itemimg img{
              width: .24rem;
            }
            .hospitalItem li:nth-of-type(1), .hospitalItem li:nth-of-type(2) {
              border-top: 1px solid #fff;
            }
            .hospitalItem li:nth-of-type(2n + 1) section{
              border-right: 1px solid #e6e6e6;
            }
            .hospitalItem li dt{
              font-size: 16px;
              color: ${theme.mainfontcolor};
              font-weight: 500;
            }
            .hospitalItem li dd{
              font-size: ${theme.nfontsize};
              color: ${theme.nfontcolor};
              padding-top: .06rem;
            }
          `}
        </style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    hospitals: state.hospitals.data,
    loading: state.hospitals.loading,
    error: state.hospitals.error
  }
}

export default connect(mapStateToProps, {queryHospitals})(HospitalScreen)
