import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import { Loading, PageCard, FilterCard, SelectFilterCard } from '../../../components'
import { queryExercises, queryExaminationDifficultys, querySubjects, queryChapters, querySections, selectExercise } from '../../../ducks'
import { connect } from 'react-redux'

class ExerciseListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      examinationDifficultyId: null,
      subjectId: null,
      chapterId: null,
      sectionId: null
    }
    this.type = '01'
  }

  componentWillMount () {
    const { client, querySubjects, queryExaminationDifficultys } = this.props
    this.queryExercises({})
    querySubjects(client)
    queryExaminationDifficultys(client)
  }

  queryExercises (ops) {
    let { examinationDifficultyId, subjectId, chapterId, sectionId } = ops || this.state
    const { client, queryExercises } = this.props
    const { page } = this.state
    const skip = (page - 1) * 10
    const limit = 10
    queryExercises(client, { skip, limit, type: this.type, examinationDifficultyId, subjectId, chapterId, sectionId })
  }

  changeStatus (key, value) {
    if (value === '') value = null
    let { subjectId, chapterId, sectionId } = this.state
    if (key === 'subjectId') {
      chapterId = null
      sectionId = null
    }
    if (key === 'chapterId') {
      sectionId = null
    }
    let obj = Object.assign({}, { subjectId, chapterId, sectionId }, { [key]: value, page: 1 })
    this.setState(obj)
    this.queryExercises(obj)
  }

  queryChapters (subjectId) {
    if (!subjectId) return
    const { client, queryChapters } = this.props
    queryChapters(client, { subjectId })
  }

  querySections (chapterId) {
    if (!chapterId) return
    const { client, querySections } = this.props
    querySections(client, { chapterId })
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

  getChapters () {
    const { subjectId } = this.state
    const { chapters } = this.props
    let array = []
    for (let key in chapters) {
      if (chapters[key].subjectId !== subjectId) continue
      array.push({ title: chapters[key].name, value: key })
    }
    return array
  }

  getSections () {
    const { chapterId } = this.state
    const { sections } = this.props
    let array = []
    for (let key in sections) {
      if (sections[key].chapterId !== chapterId) continue
      array.push({ title: sections[key].name, value: key })
    }
    return array
  }

  goToDetail (exerciseId) {
    const { selectExercise } = this.props
    selectExercise({ exerciseId })
    Router.push('/exercise/detail')
  }

  getListData () {
    let array = []
    const { page, examinationDifficultyId, subjectId, chapterId, sectionId } = this.state
    let { exercises } = this.props
    let skip = (page - 1) * 10
    let count = 0
    for (let key in exercises) {
      let exercise = exercises[key]
      if (exercise.type !== this.type) continue
      if (examinationDifficultyId && exercise.examinationDifficultyId !== examinationDifficultyId) continue
      if (subjectId && exercise.subjectId !== subjectId) continue
      if (chapterId && exercise.chapterId !== chapterId) continue
      if (sectionId && exercise.sectionId !== sectionId) continue
      let limit = count - skip
      if (limit > -1 && limit < 10) {
        array.push(Object.assign({}, exercise, { key, index: count }))
      }
      count++
    }
    return array
  }

  renderTitle () {
    return (
      <ul className='flex tb-flex orderTitle'>
        <li className={'numberText titleText'} key={1}>
          序号
        </li>
        <li className={'contentText titleText '} key={2}>
          题干
        </li>
        <li className={'subjectText titleText'} key={3}>
          考试类型
        </li>
        <li className={'subjectText titleText'} key={4}>
          科目
        </li>
        <li className={'subjectText titleText'} key={5}>
          章
        </li>
        <li className={'subjectText titleText'} key={6}>
          节
        </li>
        <li className={'hotText titleText'} key={7}>
          热门
        </li>
        <li className={'hotText titleText'} key={8}>
          查看
        </li>
        <style jsx>{`
          .orderTitle {
            color: #797979;
            background: #f2f2f2;
            padding: 10px 15px;
            border-radius: 3px;
          }
          .titleText {
            padding: 0px, 10px;
            font-size: 16px;
          }
          .numberText {
            width: 5%;
            text-align: left;
          }
          .contentText {
            width: 52%;
            text-align: left;
          }
          .subjectText {
            width: 11%;
            text-align: center;
          }
          .hotText {
            width: 5%;
            text-align: center;
          }
        `}</style>
      </ul>
    )
  }

  renderRow (item, index) {
    return (
      <ul className='flex tb-flex listItem' key={item.id}>
        <li className={'numberText'} key={1}>
          {item.index + 1}
        </li>
        <li className={'contentText textoverflow1'} key={2}>
          {item.content || '无'}
        </li>
        <li className={'subjectText'} key={3}>
          {item.examinationDifficultyName || '无'}
        </li>
        <li className={'subjectText'} key={4}>
          {item.subjectName || '无'}
        </li>
        <li className={'subjectText'} key={5}>
          {item.chapterName || '无'}
        </li>
        <li className={'subjectText'} key={6}>
          {item.sectionName || '无'}
        </li>
        <li className={'hotText'} key={7}>
          {item.hot ? '是' : '否'}
        </li>
        <li className={'hotText'} key={8}>
          <button
            className='fenyeItem'
            onClick={() => this.goToDetail(item.id)}
          >
            查看
          </button>
        </li>
        <style jsx>{`
          .numberText {
            width: 5%;
            text-align: left;
          }
          .contentText {
            width: 52%;
            text-align: left;
          }
          .subjectText {
            width: 11%;
            text-align: center;
          }
          .hotText {
            width: 5%;
            text-align: center;
          }
          .fenyeItem {
            background: #3ca0ff;
            border-radius: 2px;
            display: inline-block;
            cursor: pointer;
            border: 1px solid #3ca0ff;
            color: #fff;
          }
        `}</style>
      </ul>
    )
  }

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
    }
    let exercises = this.getListData()
    return (
      <div className={'orderRecordsPage'}>
        <FilterCard>
          <SelectFilterCard
            data={this.getExaminationdifficultys()}
            status={this.state.status}
            config={{ selectTitle: '考试类型', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
              console.log('status ======== ', status)
              this.changeStatus('examinationDifficultyId', status)
            }}
          />
          <SelectFilterCard
            data={this.getSubjects()}
            status={this.state.status}
            config={{ selectTitle: '科目', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
              this.queryChapters(status)
              this.changeStatus('subjectId', status)
            }}
          />
          <SelectFilterCard
            data={this.getChapters()}
            status={this.state.status}
            config={{ selectTitle: '章', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
              this.querySections(status)
              this.changeStatus('chapterId', status)
            }}
          />
          <SelectFilterCard
            data={this.getSections()}
            status={this.state.status}
            config={{ selectTitle: '节', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
              this.changeStatus('sectionId', status)
            }}
          />
        </FilterCard>
        {this.renderTitle()}
        {exercises.map((item, index) => {
          return this.renderRow(item, index)
        })}
        <PageCard
          data={exercises}
          page={this.state.page}
          clickPage={type => {
            const prevPage = this.state.page
            let curPage
            if (type === 'prev') {
              curPage = prevPage - 1
            } else if (type === 'next') {
              curPage = prevPage + 1
            } else {
              curPage = type
            }
            this.setState(
              {
                page: curPage
              },
              () => {
                this.queryExercises()
              }
            )
          }}
        />
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    exercises: state.exercises.data,
    subjects: state.subjects.data,
    chapters: state.chapters.data,
    sections: state.sections.data,
    examinationdifficultys: state.examinationdifficultys.data
  }
}

export default connect(mapStateToProps, { queryExercises, queryExaminationDifficultys, querySubjects, queryChapters, querySections, selectExercise })(ExerciseListScreen)
