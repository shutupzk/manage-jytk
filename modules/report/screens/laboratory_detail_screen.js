import React, { Component } from 'react'
import { connect } from 'react-redux'
// import moment from 'moment'
import {
  queryLaboratoryItems
} from '../../../ducks'
import {isEmptyObject} from '../../../utils'
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
    if (laboratory.inspectionItems && laboratory.inspectionItems.length > 0) {
      return (
        <div>
          {
            laboratory.inspectionItems.map((item, i) => (
              <div key={item.id} style={{padding: '0px 10px', display: 'flex', backgroundColor: i % 2 === 0 ? '#F8F8F8' : 'white'}}>
                {/*<div className='itemTitleView' style={{flex: 1, borderLeftWidth: 0}}>
                  <div className={'itemText'}>{i + 1}</div>
                </div>*/}
                <div className='itemTitleView' style={{flex: 4, borderLeftWidth: 0}}>
                  <div className={'itemText'}>{item.itemName}</div>
                </div>
                <div className='itemTitleView' style={{flex: 3}}>
                  <div style={{fontSize: 14, textAlign: 'center', color: item.abnormalSign === '正常' ? '#505050' : 'white', backgroundColor: item.abnormalSign === '低' ? 'green' : (item.abnormalSign === '正常' ? '#ffffff' : '#E94C47')}}>
                    {item.resultValue}{item.abnormalSign === '低' ? '↓' : (item.abnormalSign === '正常' ? '' : '↑')}
                  </div>
                </div>
                <div className='itemTitleView' style={{flex: 2}}>
                  <div className={'itemText'}>{item.unit}</div>
                </div>
                <div className='itemTitleView' style={{flex: 3}}>
                  <div className={'itemText'}>{item.minValue}-{item.maxValue}</div>
                </div>
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
      return <div>loading...</div>
    }
    if (this.props.error) {
      return <div>error...</div>
    }
    let laboratory = this.getData()
    // let patients = this.props.patients
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
              <div style={{textAlign: 'center'}}>检验：{laboratory.inspectTime} &nbsp;报告：{laboratory.reportTime}</div>
              {/*<div className={'titleTextView'}>
                <div className={'userText'}>姓名: {patients[Object.keys(patients)[0]].name}</div>
                <div className={'userText'}>性别: {patients[Object.keys(patients)[0]].sex === '1' ? '男' : '女'}</div>
                <div className={'userText'}>年龄: {nowDate.diff(thenDate, 'years')}</div>
              </div>*/}
            </div>
            <div style={{backgroundColor: '#ffffff', padding: '10px'}}>样本： {laboratory.sampleName}</div>
            <div className={'itemTitleContainerView'}>
              {/*<div className='itemTitleView' style={{flex: 1}}>
                <div className={'itemTitleText'}>序号</div>
              </div>*/}
              <div className='itemTitleView' style={{flex: 4}}>
                <div className={'itemTitleText'}>检测项目</div>
              </div>
              <div className='itemTitleView' style={{flex: 3}}>
                <div className={'itemTitleText'}>检测值</div>
              </div>
              <div className='itemTitleView' style={{flex: 2}}>
                <div className={'itemTitleText'}>单位</div>
              </div>
              <div className='itemTitleView' style={{flex: 3}}>
                <div className={'itemTitleText'}>参考值</div>
              </div>
              {/*<div className='itemTitleView' style={{flex: 2}}>
                <div className={'itemTitleText'}>结果</div>
              </div>*/}
            </div>
            {
              this._renderItems(laboratory)
            }
            <div className={'bottomView'}>
              <div style={{float: 'left'}}>
                {/*<div className={'bottomItemView'}>
                  <div className={'bottomText'}>申请科室：{laboratory.applyDept}</div>
                  <div className={'bottomText'}>报告编号：{laboratory.reportNo}</div>
                </div>
                <div className={'bottomItemView'}>
                  <div className={'bottomText'}>标本类型：{laboratory.sampleStatus}</div>
                  <div className={'bottomText'}>采样时间：{laboratory.samplingTime}</div>
                </div>*/}
                <div className={'bottomItemView'}>
                  <div className={'bottomText'}>检验医生：{laboratory.inspectDoctor}</div>
                  {/*<div className={'bottomText'}>申请时间：{laboratory.inspectTime}</div>*/}
                </div>
                <div className={'bottomItemView'}>
                  <div className={'bottomText'}>报告医生：{laboratory.reportDoctor}</div>
                  <div className={'bottomText'}>采样时间：{laboratory.samplingTime}</div>
                </div>
              </div>
              <div className={'warningView'}>
                <div className={'warningText'}>* 本报告仅供参考</div>
              </div>
            </div>
          </div>
          <style jsx global>{`
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
              font-size: 17px;
              font-weight: bold;
              color: #505050
            }
            .titleTextView {
              flex: 1;
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
              padding: 20px 10px;
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
              float: rightpx
              height: 50px
              align-items: center；
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
