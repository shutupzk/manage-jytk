import React, { Component } from 'react'
// import { Router } from '../../../routes'
// import Router from 'next/router'
import { Loading, PageCard } from '../../../components'
import { queryCourses, updateCourse } from '../../../ducks'
import { connect } from 'react-redux'

class CourseListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      sortWay: null
    }
    this.type = '02'
  }

  componentWillMount () {
    this.queryCourses({})
  }

  queryCourses ({ page }) {
    page = page || this.state.page
    const skip = (page - 1) * 10
    const limit = 10
    const { client, queryCourses } = this.props
    queryCourses(client, { skip, limit })
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
    const skip = (page - 1) * 10
    const { courses } = this.props
    let array = []
    let index = -1
    for (let key in courses) {
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
        <li className={'imageText titleText '} key={2}>
          图片
        </li>
        <li className={'titleNameText titleText '} key={21}>
          标题
        </li>
        <li className={'subjectText titleText'} key={3}>
          类型
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
            width: 10%;
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
            width: 15%;
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

  renderRow (item, index) {
    let { url, type } = item
    if (type === 'video') {
      url = url + '?vframe/jpg/offset/0'
      type = '视频'
    } else if (type === 'image') {
      type = '图文'
    }
    return (
      <ul className='flex tb-flex listItem' key={item.id}>
        <li className={'imageText'} key={2}>
          <img style={{ width: '80px', height: '80px', margin: 10 }} src={url} />
        </li>
        <li className={'titleNameText'} key={21}>
          {item.title || ''}
        </li>
        <li className={'subjectText'} key={3}>
          {type || ''}
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
              <input
                style={{ display: 'none' }}
                onClick={e => this.updateCourse(item.id, false)}
                checked
                type='checkbox'
                id={`showInternet${item.id}`}
                ref={`${item.id}Ref`}
              />
            ) : (
              <input
                style={{ display: 'none' }}
                checked={false}
                onClick={e => this.updateCourse(item.id, true)}
                type='checkbox'
                id={`showInternet${item.id}`}
                ref={`${item.id}Ref`}
              />
            )}
            <label style={{ top: '8px' }} htmlFor={`showInternet${item.id}`}>
              开启
            </label>
            <label style={{ top: '8px' }} htmlFor={`showInternet${item.id}`}>
              关闭
            </label>
          </article>
        </li>
        <style jsx>{`
          .numberText {
            width: 5%;
            text-align: left;
          }
          .imageText {
            width: 10%;
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

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
    }
    let exercises = this.getListData()
    return (
      <div className={'orderRecordsPage'}>
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
                this.queryUsers({})
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
    courses: state.courses.data
  }
}

export default connect(mapStateToProps, { queryCourses, updateCourse })(CourseListScreen)
