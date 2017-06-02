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
    console.log(laboratories)
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
              <div key={i} style={{padding: '0px 10px', display: 'flex', backgroundColor: i % 2 === 0 ? '#F8F8F8' : 'white'}}>
                <div className='itemTitleView' style={{flex: 1, borderLeftWidth: 0}}>
                  <div style={styles.itemText}>{i + 1}</div>
                </div>
                <div className='itemTitleView' style={{flex: 3, borderLeftWidth: 0}}>
                  <div style={styles.itemText}>{item.itemName}</div>
                </div>
                <div className='itemTitleView' style={{flex: 2}}>
                  <div style={{fontSize: 14, textAlign: 'center', color: item.abnormalSign === '正常' ? '#505050' : 'white', backgroundColor: item.abnormalSign === '低' ? 'green' : (item.abnormalSign === '正常' ? '#ffffff' : '#E94C47')}}>
                    {item.resultValue}{item.abnormalSign === '低' ? '↓' : (item.abnormalSign === '正常' ? '' : '↑')}
                  </div>
                </div>
                <div className='itemTitleView' style={{flex: 3}}>
                  <div style={styles.itemText}>{item.minValue}-{item.maxValue}</div>
                </div>
                <div className='itemTitleView' style={{flex: 2}}>
                  <div style={styles.itemText}>{item.abnormalSign}</div>
                </div>
              </div>
            ))
          }
        </div>
      )
    } else {
      return <div style={styles.noDataText}>暂未获取到数据</div>
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
          <div style={styles.container}>
            <div style={styles.titleView}>
              <div style={[styles.titleTextView, {alignItems: 'flex-end'}]}>
                <div style={styles.titleText}>{laboratory.inspectName}</div>
              </div>
              <div style={{textAlign: 'center'}}>检验：{laboratory.inspectTime} &nbsp;报告：{laboratory.reportTime}</div>
              {/*<div style={styles.titleTextView}>
                <div style={styles.userText}>姓名: {patients[Object.keys(patients)[0]].name}</div>
                <div style={styles.userText}>性别: {patients[Object.keys(patients)[0]].sex === '1' ? '男' : '女'}</div>
                <div style={styles.userText}>年龄: {nowDate.diff(thenDate, 'years')}</div>
              </div>*/}
            </div>
            <div style={{backgroundColor: '#ffffff', padding: '10px'}}>样本： {laboratory.sampleName}</div>
            <div style={styles.itemTitleContainerView}>
              <div className='itemTitleView' style={{flex: 1}}>
                <div style={styles.itemTitleText}>序号</div>
              </div>
              <div className='itemTitleView' style={{flex: 3}}>
                <div style={styles.itemTitleText}>检测项目</div>
              </div>
              <div className='itemTitleView' style={{flex: 2}}>
                <div style={styles.itemTitleText}>检测值</div>
              </div>
              <div className='itemTitleView' style={{flex: 3}}>
                <div style={styles.itemTitleText}>参考值</div>
              </div>
              <div className='itemTitleView' style={{flex: 2}}>
                <div style={styles.itemTitleText}>结果</div>
              </div>
            </div>
            {
              this._renderItems(laboratory)
            }
            <div style={styles.bottomView}>
              <div style={{float: 'left'}}>
                {/*<div style={styles.bottomItemView}>
                  <div style={styles.bottomText}>申请科室：{laboratory.applyDept}</div>
                  <div style={styles.bottomText}>报告编号：{laboratory.reportNo}</div>
                </div>
                <div style={styles.bottomItemView}>
                  <div style={styles.bottomText}>标本类型：{laboratory.sampleStatus}</div>
                  <div style={styles.bottomText}>采样时间：{laboratory.samplingTime}</div>
                </div>*/}
                <div style={styles.bottomItemView}>
                  <div style={styles.bottomText}>检验医生：{laboratory.inspectDoctor}</div>
                  {/*<div style={styles.bottomText}>申请时间：{laboratory.inspectTime}</div>*/}
                </div>
                <div style={styles.bottomItemView}>
                  <div style={styles.bottomText}>报告医生：{laboratory.reportDoctor}</div>
                  <div style={styles.bottomText}>采样时间：{laboratory.samplingTime}</div>
                </div>
              </div>
              <div style={styles.warningView}>
                <div style={styles.warningText}>* 本报告仅供参考</div>
              </div>
            </div>
          </div>
          <style jsx>{`
            .itemTitleView {
              justify-content: center;
              border-color: #B4B4B4;
              border-left-width: 1px;
            }
          `}</style>
        </div>
      )
    } else {
      return <div>no data</div>
    }
  }
}

const styles = {
  container: {
    flex: 1
  },
  titleView: {
    paddingTop: 20,
    // height: 80,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  titleText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#505050'
  },
  titleTextView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  userText: {
    fontSize: 14,
    color: '#505050',
    paddingHorizontal: 10
  },
  contentTitleView: {
    height: 30,
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 10
  },
  contentTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#505050'
  },
  itemTitleContainerView: {
    padding: '0px 10px',
    display: 'flex',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 25,
    textAlign: 'center',
    // backgroundColor: 'white',
    borderColor: '#B4B4B4',
    flexDirection: 'row'
  },
  itemTitleView: {
    padding: '0px 20px',
    justifyContent: 'center',
    // paddingLeft: 10,
    borderColor: '#B4B4B4',
    borderLeftWidth: 1
  },
  itemTitleText: {
    fontSize: 14,
    color: '#B4B4B4'
  },
  noDataText: {
    backgroundColor: '#ffffff',
    padding: 10,
    color: '#B4B4B4'
  },
  itemContainerView: {
    flexDirection: 'row'
  },
  itemView: {
    justifyContent: 'center',
    padding: 10
  },
  itemText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#505050'
  },
  bottomView: {
    padding: '20px 10px',
    height: 100,
    flexDirection: 'column',
    bottom: '10px'
  },
  bottomItemView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'white',
    paddingHorizontal: 10
  },
  bottomText: {
    flex: 1,
    fontSize: 13,
    color: '#B4B4B4'
  },
  warningView: {
    float: 'right',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  warningText: {
    fontSize: 14,
    color: '#B4B4B4'
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    laboratories: state.laboratories.data,
    patients: state.patients.data,
    selectId: state.laboratories.selectId,
    laboratoryLoading: state.laboratories.loading,
    laboratoryError: state.laboratories.error
  }
}

export default connect(mapStateToProps, {queryLaboratoryItems})(LaboratoryDetailScreen)
