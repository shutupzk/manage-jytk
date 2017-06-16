import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { withApollo } from 'react-apollo'
import * as actions from '../../../ducks'
// import { isEmptyObject } from '../../../utils'

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
            <div>
              <div className={'text'}>
                {description || '广东省人民医院创建于1946年，是广东省最大的综合性医院，是国内规模最大、综合实力最强的医院之一。医院建筑面积近23万平方米，在职职工5251人，其中卫生技术人员4402人，高级职称人员706人。住院床位数2852张，年出院病人11.06万人次，年手术量达到7.49万台。医院有六个门诊部，2015年门诊量约418.3万人次。'}
              </div>
              <div className={'text'}>联系电话</div>
              <div className={'text'}>
                {phone}
                <div>
                  <span>广东省人民医院东川门诊部</span>
                  <span style={{float: 'right'}}>020-83827812 </span>
                </div>
                <div>
                  <span>广东省医院惠福分院</span>
                  <span style={{float: 'right'}}>020-81884713 </span>
                </div>
              </div>
              <div className={'text'}>医院地址</div>
              <div className={'text'}>{position}</div>
              <div className={'text'}>访问官网</div>
              <div className={'text'}><a href={website || 'http://www.e5413.com'}>{website || 'http://www.e5413.com'}</a></div>
            </div>
          </div>
        }
        <style jsx>{`
          .titleStyle {
            color: #3CA0FF;
            align-self: flex-start;
          }
          .containerStyle {
            margin: 0px;
            margin-bottom: 10px;
            background-color: #fff;
            padding: 20px;
          }
          .text {
            color: #505050;
            font-size: 14px;
            margin-vertical: 2px;
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
          <div>loading...</div>
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <div>loading...</div>
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
