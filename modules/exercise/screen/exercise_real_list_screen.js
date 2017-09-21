import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import { Loading, PageCard, FilterCard, SelectFilterCard } from '../../../components'
import { queryExercises, queryYearExerciseLists, queryExaminationDifficultys, selectExercise, queryYearExerciseTypes } from '../../../ducks'
import { connect } from 'react-redux'

class ExerciseRealListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      examinationDifficultyId: null,
      yearExerciseTypeId: null,
      yearExerciseListId: null
    }
    this.type = '02'
  }

  componentWillMount () {
    const { client, queryExaminationDifficultys } = this.props
    this.queryExercises({})
    queryExaminationDifficultys(client)
  }

  queryExercises (ops) {
    let { examinationDifficultyId, yearExerciseListId } = ops || this.state
    const { client, queryExercises } = this.props
    const { page } = this.state
    const skip = (page - 1) * 10
    const limit = 10
    queryExercises(client, { skip, limit, type: this.type, examinationDifficultyId, yearExerciseListId })
  }

  changeStatus (key, value) {
    if (value === '') value = null
    let { examinationDifficultyId, yearExerciseTypeId, yearExerciseListId } = this.state
    if (key === 'examinationDifficultyId') {
      yearExerciseTypeId = null
      yearExerciseListId = null
    }
    if (key === 'yearExerciseTypeId') {
      yearExerciseListId = null
    }
    let obj = Object.assign({}, { examinationDifficultyId, yearExerciseTypeId, yearExerciseListId }, { [key]: value, page: 1 })
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

  getListData () {
    let array = []
    const { page, examinationDifficultyId, yearExerciseTypeId, yearExerciseListId } = this.state
    let { exercises } = this.props
    let skip = (page - 1) * 10
    let count = 0
    for (let key in exercises) {
      let exercise = exercises[key]
      if (exercise.type !== this.type) continue
      if (examinationDifficultyId && exercise.examinationDifficultyId !== examinationDifficultyId) continue
      if (yearExerciseTypeId && exercise.yearExerciseTypeId !== yearExerciseTypeId) continue
      if (yearExerciseListId && exercise.yearExerciseListId !== yearExerciseListId) continue
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
        <li className={'buttonText'} key={5}>
          <button
            className='fenyeItem'
            onClick={() => this.goToDetail(item.id)}
          >
            查看
          </button>
          <button
            style={{marginLeft: '5px'}}
            className='fenyeItem'
            onClick={() => this.goToEdit(item.id)}
          >
            编辑
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
    examinationdifficultys: state.examinationdifficultys.data
  }
}

export default connect(mapStateToProps, { queryExercises, queryYearExerciseLists, queryExaminationDifficultys, selectExercise, queryYearExerciseTypes })(ExerciseRealListScreen)
