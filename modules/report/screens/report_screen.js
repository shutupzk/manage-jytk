import React, {Component } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import localforage from 'localforage'

import {
  // signin,
  // queryUser,
  queryPatients,
  queryExaminations,
  selectExamination,
  queryLaboratories,
  selectLaboratory
} from '../../../ducks'
import { isEmptyObject } from '../../../utils'

class ReportScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false
    }
  }
  componentWillMount () {
    if (isEmptyObject(this.props.patients)) {
      this.setState({isInit: true})
      this.queryPatientReports()
    } else {
      this.setState({isInit: true})
      this.queryReport()
    }
  }
  getPatient (patients) {
    let patient = {}
    for (let id in patients) {
      patient = patients[id]
      break
    }
    return patient
  }
  async queryReport () {
    let patient = this.getPatient(this.props.patients)
    let patientId = patient.id
    this.props.queryExaminations(this.props.client, {patientId})
    this.props.queryLaboratories(this.props.client, {patientId})
    this.setState({isInit: false})
  }
  async queryPatientReports () {
    // const error = await this.props.signin({ username: null, password: null })
    // if (error) return console.log(error)
    const userId = this.props.userId || await localforage.getItem('userId')
    if (userId) {
      // this.props.queryUser(this.props.client, { userId })
      await this.props.queryPatients(this.props.client, {userId})
      this.queryReport()
    }
  }
  renderExamination () {
    let examinations = this.props.examinations
    if (!isEmptyObject(examinations)) {
      return (
        <div
          removeClippedSubviews={false}
          alwaysBounceVertical={false}
          data={examinations}
          keyExtractor={(item, i) => item[Object.keys(item)[0]] + i}
          initialNumToRender={5}
          ItemSeparatorComponent={() => { return <div style={{height: 5}} /> }}
          renderItem={
            ({item}) =>
              <div className={'itemView'}>
                <div className={'itemTitleView'}>
                  <div className={{ flex: 1 }}>{Object.keys(item)[0]}</div>
                  <div className={'dateTitleText'}>[{item[Object.keys(item)[0]].length}项]</div>
                </div>
                <div className={'itemContentsView'}>
                  {
                    item[Object.keys(item)[0]].map((item, i) => (
                      <div key={i}>
                        <div onClick={() => {
                          this.props.selectExamination({
                            date: item.reportTime,
                            examinationId: item.id
                          })
                          this.props.navigation.navigate('examination_detail')
                        }}>
                          <div className={'itemContentView'}>
                            <div className={'itemText'}>{item.exammineName}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
          }
        />
      )
    } else {
      return <div>no data</div>
    }
  }

  renderLaboratory () {
    let laboratories = this.props.laboratories
    if (!isEmptyObject(laboratories)) {
      return (
        <div>
          {
            laboratories.map((item, i) => {
              return (
                <div className={'itemView'} key={i}>
                  <div className={'itemTitleView'}>
                    <div style={{ flex: 1 }}>{Object.keys(item)[0]}</div>
                    <div className={'dateTitleText'}>[{item[Object.keys(item)[0]].length}项]</div>
                  </div>
                  <div className={'itemContentsView'}>
                    {
                      item[Object.keys(item)[0]].map((item, i) => (
                        <div key={item.id}>
                          <div onClick={() => {
                            this.props.selectLaboratory({
                              date: item.reportTime,
                              laboratoryId: item.id
                            })
                            Router.push('/report/laboratory_detail?laboratoryId=' + item.id + '&date=' + item.reportTime)
                          }}>
                            <div className={'itemContentView'}>
                              <div className={'itemText'}>{item.inspectName}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    } else {
      return <div>没有记录</div>
    }
  }

  render () {
    if (this.props.loading || this.state.isInit) {
      return (
        <div>loading...</div>
      )
    }
    if (this.props.error) {
      return (
        <div>error...</div>
      )
    }
    return (
      <div>
        <div style={{width: '100%'}}>
          {
           this.renderLaboratory()
          }
        </div>
        <style jsx global>{`
          .tabBarUnderlineStyle {
            background-color: #3CA0FF;
          }
          .tabBarTextStyle {
            font-size: 15px;
            font-weight: bold;
            margin-top: 5px;
          }
          .itemTitleView {
            display: flex;
            margin-bottom: 3px;
            padding: 10px;
            padding-horizontal: 10px;
            padding-vertical: 5px;
            align-items: center;
            flex-direction: row;
            background-color: #FBFBFB;
          }
          .dateTitleText {
            float: right;
            font-size: 12px
            color: #B4B4B4;
          }
          .itemView {
            margin-bottom: 10px;
            flex-direction: column;
          }
          .itemContentsView {
            background-color: white;
          }
          .itemContentView {
            padding: 5px 10px;
            background-color: white;
            justify-content: center;
            padding-horizontal: 10px;
            border-bottom: solid 1px #eeeeee;
          }
          .itemText {
            font-size: 15px;
            color: #505050;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    patients: state.patients.data,
    examinations: state.examinations.data,
    laboratories: state.laboratories.data,
    examinationLoading: state.examinations.loading,
    examinationError: state.examinations.error,
    laboratoryLoading: state.laboratories.loading,
    laboratoryError: state.laboratories.error
  }
}

export default connect(mapStateToProps, {
  // signin,
  // queryUser,
  queryPatients,
  queryExaminations,
  selectExamination,
  queryLaboratories,
  selectLaboratory
})(ReportScreen)
