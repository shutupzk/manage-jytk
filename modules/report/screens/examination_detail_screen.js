import React, { Component } from 'react'
import { connect } from 'react-redux'
// import moment from 'moment'
import {
  queryExaminationDetail
} from '../../../ducks'
import {isEmptyObject, ages} from '../../../utils'
import {theme, Loading, ErrCard, NoDataCard} from 'components'

class ExaminationDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false
    }
  }
  getData () {
    let examinations = this.props.examinations
    let { date, examinationId } = this.props.selectId
    let filterDateExaminations = this.filterDateExaminations(examinations, date)
    return this.filterExaminationsId(filterDateExaminations, examinationId)
  }
  filterDateExaminations (examinations, date) {
    let examination = examinations.filter((examination) => {
      if (date === Object.keys(examination)[0]) {
        return true
      }
      return false
    })
    return examination[0]
  }
  filterExaminationsId (filterDateExaminations, examinationId) {
    let examinations = filterDateExaminations[Object.keys(filterDateExaminations)[0]]
    let examination = examinations.filter((examination) => {
      if (examinationId === examination.id) {
        return true
      }
      return false
    })
    return examination[0]
  }
  componentWillMount () {
  }
  render () {
    if (this.props.loading || this.state.isInit) {
      return <div><Loading showLoading /></div>
    }
    if (this.props.error) {
      return <div><ErrCard /></div>
    }
    let examination = this.getData()
    if (examination) {
      return (
        <div>
          <div>
            <div className={'titleView'}>
              <div style={{alignItems: 'flex-end'}}>
                <div className={'titleText'}>{examination.exammineName}</div>
              </div>
              <div style={{textAlign: 'center', fontSize: theme.nfontsize, color: theme.fontcolor}}>姓名：{examination.patientName} &nbsp;性别：{examination.patientSex === '1' ? '男' : '女'} &nbsp;年龄: {ages(examination.patientBirthday || '')}</div>
            </div>
            <div>
              <div style={{padding: '2px 15px', fontWeight: 'bold'}}>检查参数</div>
              <div style={{backgroundColor: '#FFF', padding: '5px 15px'}}>{examination.examineParam || '暂无数据'}</div>
            </div>
            <div>
              <div style={{padding: '2px 15px', fontWeight: 'bold'}}>检查所见</div>
              <div style={{backgroundColor: '#FFF', padding: '5px 15px'}}>{examination.examineFindings || '暂无数据'}</div>
            </div>
            <div>
              <div style={{padding: '2px 15px', fontWeight: 'bold'}}>印象</div>
              <div style={{backgroundColor: '#FFF', padding: '5px 15px'}}>{examination.examineResult || '暂无数据'}</div>
            </div>
            <div className={'bottomView'}>
              <div style={{backgroundColor: '#FFF', padding: '10px 15px', marginTop: 1}}>
                <div className={'bottomText'}>报告编号 {examination.reportNo}</div>
                <div style={{display: 'flex'}}>
                  <div style={{flex: 5}}>
                    <div className={'bottomText'}>申请医生：{examination.applyDoctor}</div>
                    <div className={'bottomText'}>报告医生：{examination.reportDoctor}</div>
                  </div>
                  <div style={{flex: 8}}>
                    <div className={'bottomText'}>检查时间：{examination.examineTime}</div>
                    <div className={'bottomText'}>报告时间：{examination.reportTime}</div>
                  </div>
                </div>
              </div>
              <div className={'warningView'}>
                <div className={'warningText'}>* 本报告仅供参考</div>
              </div>
            </div>
          </div>
          <style jsx global>{`
            .itemTitleContainerView{
              background: #fff;
              line-height: .3rem;
              color: ${theme.fontcolor};
              font-size: ${theme.nfontsize};
              border-top:1px solid ${theme.bordercolor};
              border-bottom: 1px solid ${theme.bordercolor};
            }
            .itemTitleContainerViewHeader li:not(:last-child){
              border-right: 1px solid ${theme.bordercolor};
              text-indent: 6px;
            }
            .itemTitleContainerViewHeader{
              
            }
            .itemTitleContainerViewCon:nth-of-type(2n) {
              backgoround: #f8f8f8;
              line-height: .4rem;
              color: ${theme.fontcolor};
              font-size: ${theme.fontsize};
            }
            .itemTitleView {
              justify-content: center;
              border-color: #B4B4B4;
              border-left-width: 1px;
            }
            .titleView {
              padding-top: 20px;
              align-items: center;
              background-color: white;
            }
            .titleText {
              text-align: center;
              font-size: .17rem;
              color: ${theme.mainfontcolor};
              padding: 0rem 0 .1rem;
            }
            .titleTextView {
              flex: 1;
              display: flex;
              text-align: center;
              align-items: center;
              justify-content: center;
              flex-direction: row;
            }
            .userText {
              font-size: 14px;
              color: #505050;
              padding-horizontal: 10px;
            }
            .contentTitleView {
              height: 30px;
              justify-content: center;
              background-color: #F8F8F8;
              padding-horizontal: 10px;
            }
            .contentTitleText {
              font-size: 15px;
              font-weight: bold;
              color: #505050
            }
            .itemTitleContainerView {
              padding: 0px 10px;
              display: flex;
              border-top: 1px;
              border-bottom: 1px;
              height: 25px;
              text-align: center;
              border-color: #B4B4B4;
              flex-direction: row;
            }
            .itemTitleView {
              padding: 0px 20px;
              justify-content: center;
              border-color: #B4B4B4;
              border-left: 1px;
            }
            .itemTitleText {
              font-size: 14px;
              color: #B4B4B4
            }
            .noDataText {
              background-color: #ffffff;
              padding: 10px;
              color: #B4B4B4;
            }
            .itemContainerView {
              flex-direction: row;
            }
            .itemView {
              justify-content: center;
              padding: 10px;
            }
            .itemText {
              font-size: 14px;
              text-align: center;
              color: #505050;
            }
            .bottomView {
              height: 100px
              flex-direction: column;
              bottom: 10px;
            }
            .bottomItemView {
              flex: 1;
              flex-direction: row;
              align-items: center;
              padding-horizontal: 10px;
            }
            .bottomText {
              flex: 1;
              font-size: 13px;
              color: #B4B4B4;
            }
            .warningView {
              margin-top: 30px;
              height: 50px;
              text-align: center;
              align-items: center;
              justify-content: center;
            }
            .warningText {
              font-size: 14px;
              color: #B4B4B4;
            }
          `}</style>
        </div>
      )
    } else {
      return <div><NoDataCard /></div>
    }
  }
}

function mapStateToProps (state) {
  return {
    examinations: state.examinations.data,
    patients: state.patients.data,
    selectId: state.examinations.selectId,
    loading: state.examinations.loading,
    error: state.examinations.error
  }
}

export default connect(mapStateToProps, {queryExaminationDetail})(ExaminationDetailScreen)
