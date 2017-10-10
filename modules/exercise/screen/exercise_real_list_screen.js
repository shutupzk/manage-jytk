import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import { Loading, PageCard, FilterCard, SelectFilterCard, KeywordCard } from '../../../components'
import { queryExercises, queryYearExerciseLists, queryExaminationDifficultys, selectExercise, queryYearExerciseTypes, queryYearExamTypes, removeExercise } from '../../../ducks'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'

class ExerciseRealListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      examinationDifficultyId: null,
      yearExerciseTypeId: null,
      yearExerciseListId: null,
      yearExamTypeId: null
    }
    this.type = '02'
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 2500,
      transition: 'scale'
    }
  }

  componentWillMount () {
    const { client, queryExaminationDifficultys, queryYearExamTypes } = this.props
    this.queryExercises({})
    queryExaminationDifficultys(client)
    queryYearExamTypes(client)
  }

  queryExercises (ops) {
    let { examinationDifficultyId, yearExerciseListId, yearExamTypeId } = ops || this.state
    const { client, queryExercises } = this.props
    const { page } = this.state
    const skip = (page - 1) * 10
    const limit = 10
    queryExercises(client, { skip, limit, type: this.type, examinationDifficultyId, yearExerciseListId, yearExamTypeId })
  }

  changeStatus (key, value) {
    if (value === '') value = null
    let { examinationDifficultyId, yearExerciseTypeId, yearExerciseListId, yearExamTypeId, keyword } = this.state
    if (key === 'examinationDifficultyId') {
      yearExerciseTypeId = null
      yearExerciseListId = null
      yearExamTypeId = null
    }
    if (key === 'yearExerciseTypeId') {
      yearExerciseListId = null
      yearExamTypeId = null
    }
    if (key === 'yearExerciseListId') {
      yearExamTypeId = null
    }
    let obj = Object.assign({}, { examinationDifficultyId, yearExerciseTypeId, yearExerciseListId, yearExamTypeId, keyword }, { [key]: value, page: 1 })
    this.setState(obj)
    this.queryExercises(obj)
  }

  goToDetail (exerciseId) {
    const { selectExercise } = this.props
    selectExercise({ exerciseId })
    Router.push('/exercise/detail')
  }

  goToEdit (exerciseId) {
    const { selectExercise } = this.props
    selectExercise({ exerciseId })
    Router.push('/exercise/edit')
  }

  queryYearExerciseLists (yearExerciseTypeId) {
    if (!yearExerciseTypeId) return
    const { client, queryYearExerciseLists } = this.props
    queryYearExerciseLists(client, { yearExerciseTypeId })
  }

  getYearExerciseTypes () {
    const { yearexercisetypes } = this.props
    const { examinationDifficultyId } = this.state
    let array = []
    for (let key in yearexercisetypes) {
      if (yearexercisetypes[key].examinationDifficultyId !== examinationDifficultyId) continue
      array.push({ title: yearexercisetypes[key].name, value: key })
    }
    return array
  }

  getExaminationdifficultys () {
    const { examinationdifficultys } = this.props
    let array = []
    for (let key in examinationdifficultys) {
      array.push({ title: examinationdifficultys[key].name, value: key })
    }
    return array
  }

  getYearExerciseLists () {
    const { yearexerciselists } = this.props
    const { yearExerciseTypeId } = this.state
    let array = []
    for (let key in yearexerciselists) {
      if (yearexerciselists[key].yearExerciseTypeId !== yearExerciseTypeId) continue
      array.push({ title: yearexerciselists[key].year, value: key })
    }
    return array
  }

  getYearExamTypes () {
    const { yearexamtypes } = this.props
    let array = []
    for (let key in yearexamtypes) {
      array.push({ title: yearexamtypes[key].name, value: key })
    }
    return array
  }

  async deleteExercise (item) {
    const { id, content } = item
    const confirmed = confirm(`确定要删除题目  《${content}》  吗？`)
    if (confirmed) {
      const { client, removeExercise } = this.props
      let error = await removeExercise(client, { id })
      if (error) {
        return this.msg.show('删除失败')
      }
      this.msg.show('删除成功', {
        time: 1000,
        type: 'success'
      })
    }
  }

  getListData () {
    let array = []
    const { page, examinationDifficultyId, yearExerciseTypeId, yearExerciseListId, yearExamTypeId, keyword } = this.state
    let { exercises } = this.props
    let skip = (page - 1) * 10
    let count = 0
    for (let key in exercises) {
      let exercise = exercises[key]
      if (exercise.type !== this.type) continue
      if (examinationDifficultyId && exercise.examinationDifficultyId !== examinationDifficultyId) continue
      if (yearExerciseTypeId && exercise.yearExerciseTypeId !== yearExerciseTypeId) continue
      if (yearExerciseListId && exercise.yearExerciseListId !== yearExerciseListId) continue
      if (yearExamTypeId && exercise.yearExamTypeId !== yearExamTypeId) continue
      if (keyword) {
        let pattern = new RegExp(keyword)
        const { content } = exercise
        if (!pattern.test(content)) continue
      }
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
          考试等级
        </li>
        <li className={'subjectText titleText'} key={4}>
          年份
        </li>
        <li className={'subjectText titleText'} key={41}>
          子类
        </li>
        <li className={'buttonText titleText'} key={8}>
          操作
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
          .buttonText {
            width: 10%;
            text-align: center;
          }
          .contentText {
            width: 50%;
            text-align: left;
          }
          .subjectText {
            width: 15%;
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
          {item.yearExerciseTypeName || '无'}
        </li>
        <li className={'subjectText'} key={4}>
          {item.year || '无'}
        </li>
        <li className={'subjectText'} key={41}>
          {item.yearExamTypeName || '无'}
        </li>
        <li className={'buttonText'} key={5}>
          <button className='fenyeItem' onClick={() => this.goToDetail(item.id)}>
            查看
          </button>
          <button style={{ marginLeft: '5px' }} className='fenyeItem' onClick={() => this.goToEdit(item.id)}>
            编辑
          </button>
          <button className='fenyeItemX' onClick={() => this.deleteExercise(item)}>
            删除
          </button>
        </li>
        <style jsx>{`
          .numberText {
            width: 5%;
            text-align: left;
          }
          .buttonText {
            width: 10%;
            text-align: center;
          }
          .contentText {
            width: 50%;
            text-align: left;
          }
          .subjectText {
            width: 15%;
            text-align: center;
          }
          .fenyeItemX {
            background: red;
            border-radius: 2px;
            display: inline-block;
            cursor: pointer;
            border: 1px solid red;
            color: #fff;
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

  renderItem (value, key) {
    return (
      <li className={'left textoverflow1'} key={key} style={{ width: '30%', marginRight: 10 }}>
        {value || '无'}
      </li>
    )
  }

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
    }
    const { client, queryYearExerciseTypes } = this.props
    let exercises = this.getListData()
    return (
      <div className={'orderRecordsPage'}>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        <FilterCard>
          <SelectFilterCard
            data={this.getExaminationdifficultys()}
            status={this.state.status}
            config={{ selectTitle: '考试级别', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
              this.changeStatus('examinationDifficultyId', status)
              queryYearExerciseTypes(client, { examinationDifficultyId: status })
            }}
          />
          <SelectFilterCard
            data={this.getYearExerciseTypes()}
            status={this.state.status}
            config={{ selectTitle: '考试类型', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
              this.changeStatus('yearExerciseTypeId', status)
              this.queryYearExerciseLists(status)
            }}
          />
          <SelectFilterCard
            data={this.getYearExerciseLists()}
            status={this.state.status}
            config={{ selectTitle: '年份', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
              this.changeStatus('yearExerciseListId', status)
            }}
          />
          <SelectFilterCard
            data={this.getYearExamTypes()}
            status={this.state.status}
            config={{ selectTitle: '选择子类型', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
              this.changeStatus('yearExamTypeId', status)
            }}
          />
          <KeywordCard
            config={{ placeholder: '题目内容', keyword: this.state.keyword }}
            clickfilter={keyword => {
              keyword = keyword.trim()
              this.changeStatus('keyword', keyword)
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
    yearexerciselists: state.yearexerciselists.data,
    yearexercisetypes: state.yearexercisetypes.data,
    examinationdifficultys: state.examinationdifficultys.data,
    yearexamtypes: state.yearexamtypes.data
  }
}

export default connect(mapStateToProps, { queryExercises, queryYearExerciseLists, queryExaminationDifficultys, selectExercise, queryYearExerciseTypes, queryYearExamTypes, removeExercise })(
  ExerciseRealListScreen
)
