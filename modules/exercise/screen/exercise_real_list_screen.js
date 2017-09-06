import React, { Component } from 'react'
// import { Router } from '../../../routes'
// import Router from 'next/router'
import { Loading, PageCard, FilterCard, SelectFilterCard } from '../../../components'
import { queryExercises, querySubjects, queryChapters, querySections, querySubjectExercises, queryChapterExercises, querySectionExercises } from '../../../ducks'
import { connect } from 'react-redux'

class ExerciseRealListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      subjectId: null,
      chapterId: null,
      sectionId: null
    }
  }

  componentWillMount () {
    const { client, querySubjects } = this.props
    this.queryExercises({})
    querySubjects(client)
  }

  queryExercises (ops) {
    let { subjectId, chapterId, sectionId } = ops || this.state
    const { client, queryExercises, querySubjectExercises, queryChapterExercises, querySectionExercises } = this.props
    const { page } = this.state
    const skip = (page - 1) * 10
    const limit = 10
    if (!subjectId && !sectionId && !chapterId) {
      return queryExercises(client, { skip, limit, subjectId, sectionId })
    }
    if (subjectId && !chapterId && !sectionId) {
      return querySubjectExercises(client, { subjectId, skip, limit })
    }
    if (subjectId && chapterId && !sectionId) {
      queryChapterExercises(client, { chapterId, skip, limit })
    }
    if (subjectId && chapterId && sectionId) {
      querySectionExercises(client, { sectionId, skip, limit })
    }
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
          科目
        </li>
        <li className={'subjectText titleText'} key={4}>
          章
        </li>
        <li className={'subjectText titleText'} key={5}>
          节
        </li>
        <li className={'hotText titleText'} key={6}>
          是否热门
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
            width: 40%;
            text-align: left;
          }
          .subjectText {
            width: 15%;
            text-align: center;
          }
          .hotText {
            width: 10%;
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
          {item.subjectName || '无'}
        </li>
        <li className={'subjectText'} key={4}>
          {item.chapterName || '无'}
        </li>
        <li className={'subjectText'} key={5}>
          {item.sectionName || '无'}
        </li>
        <li className={'hotText'} key={6}>
          {item.hot ? '是' : '否'}
        </li>
        <style jsx>{`
          .numberText {
            width: 5%;
            text-align: left;
          }
          .contentText {
            width: 40%;
            text-align: left;
          }
          .subjectText {
            width: 15%;
            text-align: center;
          }
          .hotText {
            width: 10%;
            text-align: center;
          }
        `}</style>
      </ul>
    )
  }

  renderItem (value, key) {
    return (
      <li className={'left textoverflow1'} key={key} style={{ width: '30%', marginRight: 10 }}>
        {value || '无'}
      </li>
    )
  }

  changeStatus (key, value) {
    if (!value) return
    let { subjectId, chapterId, sectionId } = this.state
    if (key === 'subjectId') {
      chapterId = null
    }
    if (key === 'chapterId') {
      sectionId = null
    }
    let obj = Object.assign({}, { subjectId, chapterId, sectionId }, { [key]: value, page: 1 })
    this.setState(obj)
    this.queryExercises(obj)
  }

  queryChapters (subjectId) {
    const { client, queryChapters } = this.props
    queryChapters(client, { subjectId })
  }

  querySections (chapterId) {
    const { client, querySections } = this.props
    querySections(client, { chapterId })
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

  getListData () {
    let array = []
    const { page, subjectId, chapterId, sectionId } = this.state
    let { exercises } = this.props
    let skip = (page - 1) * 10
    let count = 0
    for (let key in exercises) {
      let exercise = exercises[key]
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

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
    }
    let exercises = this.getListData()
    return (
      <div className={'orderRecordsPage'}>
        <FilterCard>
          <SelectFilterCard
            data={this.getChapters()}
            status={this.state.status}
            config={{ selectTitle: '年份', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
            }}
          />
          <SelectFilterCard
            data={this.getSubjects()}
            status={this.state.status}
            config={{ selectTitle: '科目', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
              this.changeStatus('subjectId', status)
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
    sections: state.sections.data
  }
}

export default connect(mapStateToProps, { queryExercises, querySubjects, queryChapters, querySections, querySubjectExercises, queryChapterExercises, querySectionExercises })(ExerciseRealListScreen)
