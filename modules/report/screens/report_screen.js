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
              <div style={styles.itemView}>
                <div style={styles.itemTitleView}>
                  <div style={[styles.dateTitleText, { flex: 1 }]}>{Object.keys(item)[0]}</div>
                  <div style={styles.dateTitleText}>[{item[Object.keys(item)[0]].length}项]</div>
                </div>
                <div style={styles.itemContentsView}>
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
                          <div style={styles.itemContentView}>
                            <div style={styles.itemText}>{item.exammineName}</div>
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
                <div style={styles.itemView} key={i}>
                  <div style={styles.itemTitleView}>
                    <div style={{ flex: 1 }}>{Object.keys(item)[0]}</div>
                    <div style={styles.dateTitleText}>[{item[Object.keys(item)[0]].length}项]</div>
                  </div>
                  <div style={styles.itemContentsView}>
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
                            <div style={styles.itemContentView}>
                              <div style={styles.itemText}>{item.inspectName}</div>
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
      <div style={styles.container}>
        <div style={{width: '100%'}}>
          {
           this.renderLaboratory()
          }
        </div>
      </div>
    )
  }
}
const styles = {
  container: {
    flex: 1
  },
  tabBarUnderlineStyle: {
    backgroundColor: '#3CA0FF'
  },
  tabBarTextStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5
  },
  itemTitleView: {
    display: 'flex',
    marginBottom: 3,
    padding: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FBFBFB'
  },
  dateTitleText: {
    float: 'right',
    fontSize: 12,
    color: '#B4B4B4'
  },
  itemView: {
    marginBottom: 10,
    flexDirection: 'column'
  },
  itemContentsView: {
    backgroundColor: 'white'
  },
  itemContentView: {
    padding: '5px 10px',
    backgroundColor: 'white',
    justifyContent: 'center',
    // height: 30,
    paddingHorizontal: 10,
    borderBottom: 'solid 1px #eeeeee'
  },
  itemText: {
    fontSize: 15,
    color: '#505050'
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
