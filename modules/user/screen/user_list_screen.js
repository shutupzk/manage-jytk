import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import { Loading, PageCard, FilterCard, SelectFilterCard, KeywordCard } from '../../../components'
import { queryUsers, selectUser } from '../../../ducks'
import { connect } from 'react-redux'

class ExerciseRealListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      sortWay: null
    }
    this.type = '02'
  }

  componentWillMount () {
    this.queryUsers({})
  }

  queryUsers ({ page, sort, keyword }) {
    page = page || this.state.page
    sort = sort || this.state.sort
    keyword = keyword || this.state.keyword
    const skip = (page - 1) * 10
    const limit = 10
    const { client, queryUsers } = this.props
    queryUsers(client, { skip, limit, sort, keyword })
  }

  getSortWay () {
    let array = [{ title: '按积分排序', value: 'score' }, { title: '按做题数排序', value: 'countUserAnswer' }, { title: '按付费金额排序', value: 'payFee' }]
    return array
  }

  changeSortWay (sortWay) {
    if (sortWay === '') sortWay = null
    let sort = { _id: -1 }
    if (sortWay !== null) {
      sort = { [sortWay]: -1 }
    }
    sort = JSON.stringify(sort)
    this.setState({ sortWay, page: 1, keyword: null, sort })
    this.queryUsers({ page: 1, sort })
  }

  getListData () {
    const { users } = this.props
    const { page, keyword } = this.state
    const skip = (page - 1) * 10
    const limit = 10
    let array = []
    let index = -1
    let arr = []
    for (let key in users) {
      arr.push(users[key])
    }
    let srotWay = this.state.sortWay || 'id'
    arr = arr.sort((a, b) => b[srotWay] - a[srotWay])
    for (let user of arr) {
      if (keyword) {
        let pattern = new RegExp(keyword)
        const { phone, name } = user
        if (!pattern.test(phone) && !pattern.test(name)) continue
      }
      index++
      if (index < skip || index + 1 > skip + limit) {
        continue
      }
      array.push(Object.assign({}, user, { key: user.id, index }))
    }
    return array
  }

  goToDetail (userId) {
    const { selectUser } = this.props
    selectUser({ userId })
    Router.push('/user/edit')
  }

  renderTitle () {
    return (
      <ul className='flex tb-flex orderTitle'>
        <li className={'numberText titleText'} key={1}>
          序号
        </li>
        <li className={'subjectText titleText '} key={2}>
          手机号
        </li>
        <li className={'subjectText titleText '} key={21}>
          姓名
        </li>
        <li className={'subjectText titleText '} key={22}>
          会员
        </li>
        <li className={'subjectText titleText '} key={221}>
          累计充值
        </li>
        <li className={'subjectText titleText'} key={3}>
          积分
        </li>
        <li className={'subjectText titleText'} key={4}>
          已用积分
        </li>
        <li className={'subjectText titleText'} key={5}>
          累计做题数
        </li>
        <li className={'subjectText titleText'} key={6}>
          累计正确数
        </li>
        <li className={'subjectText titleText'} key={68}>
          观看视频数
        </li>
        <li className={'subjectText titleText'} key={7}>
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
            width: 50%;
            text-align: left;
          }
          .subjectText {
            width: 20%;
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
        <li className={'subjectText'} key={2}>
          {item.phone || '无'}
        </li>
        <li className={'subjectText'} key={21}>
          {item.name || ''}
        </li>
        <li className={'subjectText'} key={22}>
          <span style={{ color: 'red' }}>{item.member ? item.member.name : ''}</span>
        </li>
        <li className={'subjectText'} key={123}>
          {item.payFee} 元
        </li>
        <li className={'subjectText'} key={3}>
          {item.score || 0}
        </li>
        <li className={'subjectText'} key={4}>
          {item.scoreUsed || 0}
        </li>
        <li className={'subjectText'} key={5}>
          {item.countUserAnswer || 0}
        </li>
        <li className={'subjectText'} key={6}>
          {item.countRightUserAnswer || 0}
        </li>
        <li className={'subjectText'} key={65}>
          {item.userCourseCount || 0}
        </li>
        <li className={'subjectText'} key={7}>
          <button className='fenyeItem' onClick={() => this.goToDetail(item.id)}>
            设置
          </button>
        </li>
        <style jsx>{`
          .numberText {
            width: 5%;
            text-align: left;
          }
          .contentText {
            width: 50%;
            text-align: left;
          }
          .subjectText {
            width: 20%;
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
    let exercises = this.getListData()
    return (
      <div className={'orderRecordsPage'}>
        <FilterCard>
          <SelectFilterCard
            data={this.getSortWay()}
            config={{ selectTitle: '选择排序类型', valueKey: 'value', titleKey: 'title' }}
            changeStatus={status => {
              this.changeSortWay(status)
            }}
          />
          <KeywordCard
            config={{ placeholder: '手机号/姓名', keyword: this.state.keyword }}
            clickfilter={keyword => {
              this.setState({ keyword: keyword, page: 1 }, () => this.queryUsers({ page: 1, keyword }))
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
    users: state.users.data
  }
}

export default connect(mapStateToProps, { queryUsers, selectUser })(ExerciseRealListScreen)
