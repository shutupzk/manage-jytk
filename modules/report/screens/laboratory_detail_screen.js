import React, { Component } from 'react'
import { connect } from 'react-redux'
// import moment from 'moment'
import {
  queryLaboratoryItems
} from '../../../ducks'
import {isEmptyObject, ages} from '../../../utils'
import {theme, Loading, ErrCard} from 'components'

class LaboratoryDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false
    }
  }
  getData () {
    let laboratories = this.props.laboratories
    let { date, laboratoryId } = this.props.selectId
    let filterDateLaboratories = this.filterDateLaboratories(laboratories, date)
    return this.filterLaboratoriesId(filterDateLaboratories, laboratoryId)
  }
  filterDateLaboratories (laboratories, date) {
    let laboratory = laboratories.filter((laboratory) => {
      if (date === Object.keys(laboratory)[0]) {
        return true
      }
      return false
    })
    return laboratory[0]
  }
  filterLaboratoriesId (filterDateLaboratories, laboratoryId) {
    let laboratories = filterDateLaboratories[Object.keys(filterDateLaboratories)[0]]
    let laboratory = laboratories.filter((laboratory) => {
      if (laboratoryId === laboratory.id) {
        return true
      }
      return false
    })
    return laboratory[0]
  }

  async initData () {
    this.setState({ isInit: true })
    let laboratories = this.props.laboratories
    // if (isEmptyObject(laboratories)) {
    let laboratoryId = this.props.url.query.laboratoryId
    await this.props.queryLaboratoryItems(this.props.client, {laboratoryId})
    // }
    this.setState({ isInit: false })
  }
  componentWillMount () {
    // this.initData()
    let laboratory = this.getData()
    if (!laboratory.inspectionItems || laboratory.inspectionItems.length === 0) {
      let { laboratoryId } = this.props.selectId
      this.props.queryLaboratoryItems(this.props.client, {laboratoryId: laboratoryId})
    }
  }
  _renderItems (laboratory) {
    console.log(laboratory)
    if (laboratory.laboratoryItems && laboratory.laboratoryItems.length > 0) {
      return (
        <div>
          {
            laboratory.laboratoryItems.map((item, i) => (
              <div key={item.id} className={'itemTitleContainerView itemTitleContainerViewCon'}>
                {/*<div className='itemTitleView' style={{flex: 1, borderLeftWidth: 0}}>
                  <div className={'itemText'}>{i + 1}</div>
                </div>*/}
                <li className={'left'} style={{width: '40%'}}>{item.itemName}</li>
                <li className={'left'} style={{width: '20%', color: item.abnormalSign === '正常' ? '#505050' : 'white', backgroundColor: item.abnormalSign === '低' ? 'green' : (item.abnormalSign === '正常' ? '#ffffff' : '#E94C47')}}>
                  {item.resultValue}{item.abnormalSign === '低' ? '↓' : (item.abnormalSign === '正常' ? '' : '↑')}
                </li>
                <li className={'left'} style={{width: '18%'}}>{item.unit}</li>
                <li className={'left'} style={{width: '20%'}}>{item.minValue}-{item.maxValue}</li>
                {/*<div className='itemTitleView' style={{flex: 3}}>
                  <div className={'itemText'}>{item.abnormalSign}</div>
                </div>*/}
              </div>
            ))
          }
        </div>
      )
    } else {
      return <div className={'noDataText'}>暂未获取到数据</div>
    }
  }
  render () {
    if (this.props.laboratoryLoading || this.state.isInit) {
      return <div><Loading showLoading={true} /></div>
    }
    if (this.props.error) {
      return <div><ErrCard /></div>
    }
    let laboratory = this.getData()
    let patients = this.props.patients
    // let nowDate = moment()
    // let thenDate = moment(patients[Object.keys(patients)[0]].birthday)
    if (laboratory) {
      return (
        <div>
          <div>
            <div className={'titleView'}>
              <div style={{alignItems: 'flex-end'}}>
                <div className={'titleText'}>{laboratory.inspectName}</div>
              </div>
              {/*<div style={{textAlign: 'center', fontSize: theme.nfontsize, color: theme.fontcolor}}>检验：{laboratory.inspectTime} &nbsp;报告：{laboratory.reportTime}</div>*/}
              <div style={{textAlign: 'center', fontSize: theme.nfontsize, color: theme.fontcolor}}>姓名：{laboratory.patientName} &nbsp;性别：{laboratory.patientSex === '1' ? '男' : '女'} &nbsp;年龄: {ages(laboratory.patientBirthday || '')}</div>
            </div>
            {/*<div style={{backgroundColor: '#ffffff', padding: '10px'}}>样本： {laboratory.sampleName}</div>*/}
            <ul className={'itemTitleContainerView itemTitleContainerViewHeader'}>
              <li className={'left'} style={{width: '40%'}}>检测项目</li>
              <li className={'left'} style={{width: '20%'}}>结果</li>
              <li className={'left'} style={{width: '18%'}}>单位</li>
              <li className={'left'} style={{width: '20%', border: 'none'}}>参考值</li>
              <li className='clearfix'></li>
              {/*<div className='itemTitleView' style={{flex: 2}}>
                <div className={'itemTitleText'}>结果</div>
              </div>*/}
            </ul>
            {
              this._renderItems(laboratory)
            }
            <div className={'bottomView'}>
              <div style={{backgroundColor: '#FFF', padding: '20px'}}>
                <div className={'bottomText'}>送检科室 {laboratory.applyDept}</div>
                <div style={{display: 'flex'}}>
                  <div style={{flex: 1}}>
                    <div className={'bottomText'}>标本类型：{laboratory.sampleName}</div>
                    <div className={'bottomText'}>申请医生：{laboratory.applyDoctor}</div>
                    <div className={'bottomText'}>检验医生：{laboratory.inspectDoctor}</div>
                    <div className={'bottomText'}>审核医生：{laboratory.reportDoctor}</div>
                  </div>
                  <div style={{flex: 1}}>
                    <div className={'bottomText'}>报告编号：{laboratory.reportNo}</div>
                    <div className={'bottomText'}>采样时间：{laboratory.samplingTime}</div>
                    <div className={'bottomText'}>接受时间：{laboratory.inspectTime}</div>
                    <div className={'bottomText'}>报告时间：{laboratory.reportTime}</div>
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
      return <div>no data</div>
    }
  }
}

function mapStateToProps (state) {
  return {
    laboratories: state.laboratories.data,
    patients: state.patients.data,
    selectId: state.laboratories.selectId,
    laboratoryLoading: state.laboratories.loading,
    laboratoryError: state.laboratories.error
  }
}

export default connect(mapStateToProps, {queryLaboratoryItems})(LaboratoryDetailScreen)
