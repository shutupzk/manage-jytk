import React, { Component } from 'react'
// import { Router } from '../../../routes'
// import Router from 'next/router'
import { Loading, theme, FilterCard, SelectFilterCard } from '../../../components'
import { API_SERVER } from '../../../config'
import { queryExaminationDifficultys, querySubjects } from '../../../ducks'
import { connect } from 'react-redux'
import request from 'superagent-bluebird-promise'
import AlertContainer from 'react-alert'
class ExerciseHotImportScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      examinationDifficultyId: null,
      subjectId: null
    }
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 1000,
      transition: 'scale'
    }
  }

  componentWillMount () {
    const { client, queryExaminationDifficultys, querySubjects } = this.props
    queryExaminationDifficultys(client)
    querySubjects(client)
  }

  getExaminationdifficultys () {
    const { examinationdifficultys } = this.props
    let array = []
    for (let key in examinationdifficultys) {
      array.push({ title: examinationdifficultys[key].name, value: key })
    }
    return array
  }

  getSubjects () {
    const { subjects } = this.props
    let array = []
    for (let key in subjects) {
      array.push({ title: subjects[key].name, value: key })
    }
    return array
  }

  submit () {
    if (!this.files || !this.files.length > 0) return
    const { examinationDifficultyId, subjectId, loading } = this.state
    if (!examinationDifficultyId) {
      this.setState({ loading: false })
      return this.msg.show('请选择考试等级')
    }
    if (!subjectId) {
      this.setState({ loading: false })
      return this.msg.show('请选择科目')
    }
    if (!loading) {
      this.setState({ loading: true })
      let file = this.files[0]
      console.log(file)
      request
        .post(
          `http://${API_SERVER}/uploadHot?examinationDifficultyId=` + examinationDifficultyId + '&subjectId=' + subjectId
        )
        .attach('files', this.files[0])
        .set('Accept', 'application/json')
        .then(res => {
          if (res.statusCode === 200) {
            this.setState({ loading: false, examinationDifficultyId: null, yearExerciseTypeId: null, year: null, yearExamTypeId: null })
            this.msg.show(res.text, {
              type: 'success'
            })
          } else {
            console.log('上传失败', res)
            this.setState({ loading: false, examinationDifficultyId: null, yearExerciseTypeId: null, year: null, yearExamTypeId: null })
            this.msg.show('上传失败')
          }
        })
        .catch(e => {
          console.log(e)
          this.setState({ loading: false, examinationDifficultyId: null, yearExerciseTypeId: null, year: null, yearExamTypeId: null })
          this.msg.show('上传失败')
        })
    }
  }

  loadingView () {
    if (this.state.loading) {
      return <Loading showLoading />
    }
    return null
  }

  render () {
    return (
      <div style={{ width: '80%', margin: '0 auto' }}>
        <FilterCard>
          <SelectFilterCard
            data={this.getExaminationdifficultys()}
            status={this.state.status}
            config={{ selectTitle: '考试级别', valueKey: 'value', titleKey: 'title' }}
            changeStatus={examinationDifficultyId => {
              this.setState({ examinationDifficultyId })
            }}
          />
          <SelectFilterCard
            data={this.getSubjects()}
            config={{ selectTitle: '科目', valueKey: 'value', titleKey: 'title' }}
            changeStatus={subjectId => {
              this.setState({ subjectId })
            }}
          />
        </FilterCard>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        <input
          disabled={this.state.loading}
          type='file'
          accept='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          onChange={e => {
            this.files = e.target.files
          }}
        />
        <footer style={{ margin: '30px 0' }}>
          <button disabled={this.state.loading} onClick={() => this.submit(this.props)}>
            上传
          </button>
        </footer>
        {this.loadingView()}
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
            padding: 0 0.3rem;
            font-size: 0.16rem;
          }
        `}</style>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    examinationdifficultys: state.examinationdifficultys.data,
    subjects: state.subjects.data
  }
}

export default connect(mapStateToProps, { queryExaminationDifficultys, querySubjects })(ExerciseHotImportScreen)
