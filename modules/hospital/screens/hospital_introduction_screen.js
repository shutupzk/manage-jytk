import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { withApollo } from 'react-apollo'
import * as actions from '../../../ducks'
// import { isEmptyObject } from '../../../utils'
import {theme, Loading, ErrCard} from 'components'
import {HOSPITAL_NAME} from 'config'

class IntrodectionScreen extends Component {
  componentWillMount () {
    // if (isEmptyObject(this.props.hospitalData)) {
    //   this.getIntroductions()
    // }
    this.getIntroductions()
  }
  renderIntroduceCard (title, description, phone, website, position) {
    return (
      <div>
        {
          <div className={'containerStyle'}>
            <div className={'titleStyle'}>{title}</div>
            <div className={'text'} style={{padding: '10px 15px 20px'}}>
              {description || '暂无'}
            </div>
            <div className={'texttitle'} style={{borderTop: '1px dashed #fff', borderColor: theme.bordercolor, paddingTop: 20}}>联系电话</div>
            {
              HOSPITAL_NAME.indexOf('广东省人民医院') > -1 ?
                <div className={'text'}>
                  <div>
                    <span>广东省人民医院东川门诊部</span>
                    <span style={{float: 'right'}}>020-83827812 </span>
                  </div>
                  <div>
                    <span>广东省医院惠福分院</span>
                    <span style={{float: 'right'}}>020-81884713 </span>
                  </div>
                </div>
              :
                <div className={'text'}>
                  {phone || '暂无'}
                </div>
            }
            <div className={'texttitle'}>医院地址</div>
            <div className={'text'}>{position  || '暂无'}</div>
            <div className={'texttitle'}>访问官网</div>
            <div className={'text'}><a href={website}>{website || '暂无'}</a></div>
          </div>
        }
        <style jsx>{`
          .containerStyle {
            background-color: #fff;
            padding: 10px ${theme.tbmargin} 20px;
          }
          .titleStyle {
            color: ${theme.maincolor};
            font-size: .16rem;
            border-bottom: 1px dashed ${theme.bordercolor};
            line-height: 40px;
            padding: 0 ${theme.lrmargin};
            font-weight: 500;
          }
          .text {
            color: ${theme.mainfontcolor};
            font-size: 14px;
            line-height: 26px;
            padding: 0px 15px;
          }
          .texttitle{
            color: ${theme.mainfontcolor};
            font-size: ${theme.fontsize};
            font-weight: 500;
            padding: 10px 15px 0;
          }
        `}</style>
      </div>
    )
  }
  renderCard (title, value) {
    return (
      <div>
        {
          <div>
            <div>{title}</div>
            <div>
              <div style={{color: '#505050', fontSize: 14}}>{value}</div>
            </div>
          </div>
        }
      </div>
    )
  }
  render () {
    if (this.props.loading) {
      return (
        <div>
          <div><Loading showLoading={true} /></div>
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <div><ErrCard /></div>
        </div>
      )
    }
    let hosiptal = {}
    for (let item in this.props.hospitalData) {
      hosiptal = this.props.hospitalData[item]
      break
    }
    return (
      <div>
        <div>
          {
            this.renderIntroduceCard('医院概况', hosiptal.description, hosiptal.phone, hosiptal.website, hosiptal.address)
          }
          {/* {
            this.renderCard('医院评价', hosiptal.description)
          } */}
        </div>
      </div>
    )
  }
  getIntroductions () {
    this.props.queryHospitals(this.props.client)
  }
}

function mapStateToProps (state) {
  return {
    hospitalData: state.hospitals.data,
    loading: state.hospitals.loading,
    error: state.hospitals.error
  }
}
export default connect(mapStateToProps, actions)(IntrodectionScreen)
