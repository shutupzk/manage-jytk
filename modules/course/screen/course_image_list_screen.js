import React, { Component } from 'react'
// import { Router } from '../../../routes'
// import Router from 'next/router'
import { Loading, PageCard, FilterCard, SelectFilterCard } from '../../../components'
import { queryCourses, updateCourse, removeCourse, querySubjects } from '../../../ducks'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'

class CourseImageListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      sortWay: null
    }
    this.type = '02'
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 2000,
      transition: 'scale'
    }
  }

  componentWillMount () {
    const { client, querySubjects } = this.props
    querySubjects(client)
    this.queryCourses({})
  }

  queryCourses ({ page, subjectId }) {
    page = page || this.state.page
    subjectId = subjectId || this.state.subjectId
    const skip = (page - 1) * 10
    const limit = 10
    const { client, queryCourses } = this.props
    let ops = { skip, limit, type: 'image' }
    if (subjectId) {
      ops.subjectId = subjectId
    }
    queryCourses(client, ops)
  }

  getSortWay () {
    let array = [{ title: '按积分排序', value: 'score' }, { title: '按做题数排序', value: 'countUserAnswer' }]
    return array
  }

  changeSortWay (sortWay) {
    if (sortWay === '') sortWay = null
    this.setState({ sortWay, page: 1 })
    let sort = { _id: -1 }
    if (sortWay !== null) {
      sort = { [sortWay]: -1 }
    }
    sort = JSON.stringify(sort)
    this.queryUsers({ page: 1, sort })
  }

  getListData () {
    let page = this.state.page
    let subjectId = this.state.subjectId
    const skip = (page - 1) * 10
    const { courses } = this.props
    let array = []
    let index = -1
    for (let key in courses) {
      if (courses[key].type !== 'image') continue
      if (subjectId) {
        if (!courses[key].subject || courses[key].subject.id !== subjectId) continue
      }
      index++
      if (index < skip || index + 1 > skip + 10) {
        continue
      }
      array.push(Object.assign({}, courses[key], { key, index }))
    }
    return array
  }

  renderTitle () {
    return (
      <ul className='flex tb-flex orderTitle'>
        <li className={'imageText'} key={2}>
          图片
        </li>
        <li className={'titleNameText'} key={21}>
          标题
        </li>
        <li className={'subjectText'} key={3}>
          科目
        </li>
        <li className={'contentText titleText'} key={4}>
          摘要
        </li>
        <li className={'subjectText titleText'} key={5}>
          日期
        </li>
        <li className={'subjectText titleText'} key={7}>
          推荐
        </li>
        <li className={'subjectText titleText'} key={8}>
          删除
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
          .imageText {
            width: 15%;
            text-align: left;
          }
          .titleNameText {
            width: 20%;
            text-align: left;
          }
          .contentText {
            width: 35%;
            text-align: left;
          }
          .subjectText {
            width: 10%;
            text-align: center;
          }
        `}</style>
      </ul>
    )
  }

  updateCourse (id, hot) {
    const { client, updateCourse } = this.props
    updateCourse(client, { id, hot })
  }

  async deleteCourse (item) {
    const { id, title } = item
    const confirmed = confirm(`确定要删除课程  《${title}》  吗？`)
    if (confirmed) {
      const { client, removeCourse } = this.props
      let error = await removeCourse(client, { id })
      if (error) {
        return this.msg.show('删除失败')
      }
      this.msg.show('删除成功', {
        time: 1000,
        type: 'success'
      })
    }
  }
  renderRow (item, index) {
    let { url, subject } = item
    url = url + '?imageView2/1/w/180/h/120'
    return (
      <ul className='flex tb-flex listItem' key={item.id}>
        <li className={'imageText'} key={2}>
          <img style={{ width: '80px', height: '80px' }} src={url} />
        </li>
        <li className={'titleNameText'} key={21}>
          {item.title || ''}
        </li>
        <li className={'subjectText'} key={3}>
          {subject ? subject.name : '无'}
        </li>
        <li className={'contentText'} key={4}>
          {item.abstract || ''}
        </li>
        <li className={'subjectText'} key={5}>
          {item.date || ''}
        </li>
        <li className={'subjectText'} key={7}>
          <article className='checkboxRow'>
            {item.hot ? (
              <input style={{ display: 'none' }} onClick={e => this.updateCourse(item.id, false)} checked type='checkbox' id={`showInternet${item.id}`} ref={`${item.id}Ref`} />
            ) : (
              <input style={{ display: 'none' }} checked={false} onClick={e => this.updateCourse(item.id, true)} type='checkbox' id={`showInternet${item.id}`} ref={`${item.id}Ref`} />
            )}
            <label style={{ top: '8px' }} htmlFor={`showInternet${item.id}`}>
              开启
            </label>
            <label style={{ top: '8px' }} htmlFor={`showInternet${item.id}`}>
              关闭
            </label>
          </article>
        </li>
        <li className={'subjectText'} key={8}>
          <button className='fenyeItemX' onClick={() => this.deleteCourse(item)}>
            删除
          </button>
        </li>
        <style jsx>{`
          .numberText {
            width: 5%;
            text-align: left;
          }
          .fenyeItemX {
            background: red;
            border-radius: 2px;
            display: inline-block;
            cursor: pointer;
            border: 1px solid red;
            color: #fff;
          }
          .imageText {
            width: 15%;
            text-align: left;
          }
          .titleNameText {
            width: 20%;
            text-align: left;
          }
          .contentText {
            width: 35%;
            text-align: left;
          }
          .subjectText {
            width: 10%;
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
          .checkboxRow {
            position: relative;
            height: 24px;
            width: 56px;
            display: inline-block;
          }
          .checkboxRow label {
            color: #b4b4b4;
            border: 1px solid #d8d8d8;
            background: #f2f2f2;
            padding-left: 10px;
            padding-right: 0;
            border-radius: 16px;
            line-height: 0.19rem;
            text-align: center;
            width: 0.44rem;
            font-size: 12px;
            position: absolute;
            display: block;
            top: 0;
            left: 0;
          }
          .checkboxRow label:nth-of-type(1) {
            color: #3464ca;
            border: 1px solid #3464ca;
            padding-right: 10px;
            padding-left: 0;
            background: #e4edff;
            opacity: 0;
            z-index: 1;
          }
          .checkboxRow label:nth-of-type(1):after,
          .checkboxRow label:nth-of-type(2):before {
            display: inline-block;
            content: '';
            width: 0.14rem;
            height: 0.14rem;
            background: #d8d8d8;
            border-radius: 100%;
            position: absolute;
            top: 2px;
          }
          .checkboxRow label:nth-of-type(1):after {
            right: 2px;
            background: #3464ca;
          }
          .checkboxRow label:nth-of-type(2):before {
            left: 2px;
          }
          .checkboxRow input[type='checkbox']:checked + label:nth-of-type(2) {
            opacity: 0;
          }
          .checkboxRow input[type='checkbox']:checked + label:nth-of-type(1) {
            opacity: 1;
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

  getSubjects () {
    const { subjects } = this.props
    let array = []
    for (let key in subjects) {
      array.push({ title: subjects[key].name, value: key })
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
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        <FilterCard>
          <SelectFilterCard
            data={this.getSubjects()}
            config={{ selectTitle: '科目', valueKey: 'value', titleKey: 'title' }}
            changeStatus={subjectId => {
              if (subjectId === 'value') {
                subjectId = null
              }
              this.setState({ subjectId, page: 1 })
              this.queryCourses({ page: 1, subjectId })
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
                this.queryCourses({})
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
    courses: state.courses.data,
    subjects: state.subjects.data
  }
}

export default connect(mapStateToProps, { queryCourses, querySubjects, updateCourse, removeCourse })(CourseImageListScreen)
