import React, { Component } from 'react'
import Router from 'next/router'
import { Loading, theme } from '../../../components'
// import { API_SERVER } from '../../../config'
import { queryExaminationDifficultys, queryAnswers, queryAnalysiss } from '../../../ducks'
import { connect } from 'react-redux'
import moment from 'moment'
// import request from 'superagent-bluebird-promise'
// import AlertContainer from 'react-alert'
class ExerciseImportScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      examinationDifficultyId: null
    }
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
  }

  componentWillMount () {
    const { client, queryAnswers, queryAnalysiss, exerciseId } = this.props
    queryAnswers(client, { exerciseId })
    queryAnalysiss(client, { exerciseId })
  }

  loadingView () {
    if (this.state.loading) {
      return <Loading showLoading />
    }
    return null
  }

  getAnswers () {
    let keys = ['A', 'B', 'C', 'D', 'E']
    const { answers, exerciseId } = this.props
    let array = []
    let answerKey = ''
    for (let key in answers) {
      let answer = answers[key]
      if (answer.exerciseId !== exerciseId) continue
      let str = keys[answer.num - 1] + '、' + answer.content
      if (answer.isAnswer) answerKey = keys[answer.num - 1]
      array.push(str)
    }
    return { answers: array, answerKey }
  }

  getAnalysiss () {
    const { analysiss, exerciseId } = this.props
    let array = []
    for (let key in analysiss) {
      let analysis = analysiss[key]
      if (analysis.exerciseId !== exerciseId) continue
      array.push(Object.assign({}, analysis, { key }))
    }
    return array
  }

  getData () {
    const { exercises, exerciseId } = this.props
    return exercises[exerciseId]
  }

  render () {
    const exercise = this.getData()
    const { answers, answerKey } = this.getAnswers()
    const analysiss = this.getAnalysiss()
    return (
      <div>
        <div>
          <p style={{ backgroundColor: '#f2f2f2', padding: 10, fontSize: 20 }}>
            题目<button
              onClick={() => {
                Router.push('/exercise/edit')
              }}
              style={{ marginLeft: '5%' }}
            >
              编辑
            </button>
          </p>
          <div style={{ marginTop: 20, marginBottom: 20, marginLeft: 40, marginRight: 40 }}>
            <p style={{ fontSize: 20, marginBottom: 15 }}>{exercise.content}</p>
            {answers.map((item, index) => (
              <p key={index} style={{ fontSize: 15, marginBottom: 5 }}>
                {item}
              </p>
            ))}
            {this.loadingView()}
            <p style={{ color: 'green', fontSize: 20 }}>
              正确答案：<span style={{ color: '#3ca0ff', fontSize: 20 }}>{answerKey}</span>
            </p>
          </div>
        </div>
        <div style={{ marginTop: 20, marginBottom: 100 }}>
          <p style={{ backgroundColor: '#f2f2f2', padding: 10, fontSize: 20 }}>解析</p>
          <div style={{ marginTop: 20, marginBottom: 20, marginLeft: 40, marginRight: 40 }}>
            {analysiss.map((item, index) => (
              <div style={{ marginBottom: 20 }} key={item.id}>
                {index === 0 ? null : <div style={{ backgroundColor: '#f2f2f2', height: 1, marginBottom: 20 }} />}
                <p style={{ fontSize: 18 }}>
                  发布者：
                  <span style={{ color: '#3ca0ff', fontSize: 18, marginRight: 20 }}>{item.user ? item.user.name : '管理员'}</span>
                  <span style={{ fontSize: 15, marginRight: 20 }}>时间：{moment(item.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                </p>
                <p style={{ fontSize: 15 }}>{item.content}</p>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          .loginPageText {
            background: #fff;
            margin: 0.2rem ${theme.tbmargin} 0;
          }
          .loginPageText section {
            height: 0.46rem;
            line-height: 0.46rem;
            color: ${theme.mainfontcolor};
          }
          .loginPageText input {
            background: transparent;
            border: none;
            line-height: 0.46rem;
            font-size: ${theme.fontsize};
            padding-left: 0.06rem;
            border-radius: 0;
            margin-left: 0.1rem;
            border: 1px solid ${theme.bordercolor};
          }
          .loginPageBtnItem {
            margin: 0.25rem 0 0.1rem;
          }
          button {
            border: 1px solid ${theme.bordercolor};
            background-image: linear-gradient(-180deg, #fefefe, #fbfbfb);
            margin: 0 0.15rem;
            line-height: 0.36rem;
            border-radius: 0.05rem;
            padding: 0 0.3rem;
            font-size: 0.16rem;
          }
          .titleText {
            padding: 0px, 10px;
            font-size: 16px;
          }
          .numberText {
            width: 5%;
            text-align: left;
          }
        `}</style>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    exercises: state.exercises.data,
    exerciseId: state.exercises.selectId,
    answers: state.answers.data,
    analysiss: state.analysiss.data
  }
}

export default connect(mapStateToProps, { queryExaminationDifficultys, queryAnswers, queryAnalysiss })(ExerciseImportScreen)
