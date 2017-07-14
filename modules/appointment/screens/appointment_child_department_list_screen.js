import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// import localforage from 'localforage'
import Router from 'next/router'
import localforage from 'localforage'

// import SearchBar from '../components/search_bar'
import DepartmentList from '../../hospital/components/department_list'
import { signin, queryUser, queryPatients, queryChildDepartments, selectDepartment } from '../../../ducks'
import { isEmptyObject, convertPinyin, convertPinyinFirst, replaceSearchKey } from '../../../utils'
import {Loading, ErrCard, RequireLoginCard, NoDataCard} from 'components'

class AppointmentDepartmentListScreen extends Component {
  constructor (props) {
    super(props)
    this.toDetail = false
    this.state = {showTipModal: true, searchFlag: false, searchResult: []}
  }
  componentWillMount () {
    this.autoSignin()
    // if (!this.props.token) {
    //   this.getCurrentUser()
    // }
    if (isEmptyObject(this.props.data)) {
      this.getDepartments()
    }
  }
  async autoSignin () {
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId || await localforage.getItem('userId')
    if (userId) {
      this.props.queryUser(this.props.client, { userId })
      this.props.queryPatients(this.props.client, {userId})
    }
  }
  // async getCurrentUser () {
  //   let userId = await localforage.getItem('userId')
  //   console.log(userId)
  //   this.props.queryUser(this.props.client, { userId })
  // }
  selectDepartment (dep) {
    this.props.selectDepartment({departmentId: dep.id})
    var href = {pathname: '/appointment/doctor_list', query: {departmentId: dep.id}}
    Router.push(href)
  }
  getDepartments () {
    console.log(this.props.parentId)
    this.props.queryChildDepartments(this.props.client, {departmentId: this.props.parentId})
  }
  searchDept (theData, term) {
    this.setState({searchFlag: true, searchResult: filterData(theData, term)})
  }

  filterByParentId (departments, parentId) {
    let depArr = []
    for (let key in departments) {
      if (departments[key].parentId === parentId) {
        depArr.push(departments[key])
      }
    }
    return depArr
  }
  render () {
    let departments = this.props.departments
    if (!this.props.token) {
      return (
        <div>
          <span><RequireLoginCard /></span>
        </div>
      )
    }
    if (this.props.loading && !this.toDetail) {
      return (
        <div>
          <span><Loading showLoading /></span>
        </div>
      )
    }
    if (this.props.error && !this.toDetail) {
      return (
        <div>
          <span><ErrCard /></span>
        </div>
      )
    }
    if (!isEmptyObject(departments)) {
      const deps = this.filterByParentId(departments, this.props.parentId)
      return (
        <div>
          <div style={{background: '#e6e6e6', padding: '6px 15px'}}>
            <div
              className='flex tb-flex lr-flex'
              style={{alignItems: 'center',
                border: '1px solid #d8d8d8',
                borderRadius: '3px',
                color: '#b4b4b4',
                backgroundColor: '#fff',
                height: 20,
                padding: 5,
                textAlign: 'center'}}
              onClick={() => { Router.push('/appointment/search') }}
            >
              {/*<SearchBar departments={this.props.departments} searchDep={(theData, term) => { this.searchDept(theData, term) }} /> */}
              <img src='/static/icons/search.png' style={{height: 15, marginRight: 10}} />
              <span>搜索科室或医生</span>
            </div>
          </div>
          <DepartmentList deps={deps} selectDepartment={(dep) => { this.selectDepartment(dep) }} searchKey={(text) => { return replaceSearchKey(text, 'undefind') }} />
        </div>
      )
    } else {
      return <div><NoDataCard /></div>
    }
  }
}

function mapStateToProps (state) {
  // let userId = await localforage.getItem('userId')
  // let token = await localforage.getItem('token')
  // let user = {
  //   userId,
  //   token
  // }
  console.log(state)
  return {
    token: state.user.data.token,
    user: state.user.data,
    patients: state.patients.data,
    departments: state.departments.data,
    parentId: state.departments.parentId,
    loading: state.departments.loading || state.user.loading,
    error: state.departments.error || state.user.error
  }
}
export default connect(mapStateToProps, { signin, queryUser, queryPatients, queryChildDepartments, selectDepartment })(AppointmentDepartmentListScreen)

function filterData (theData, term) {
  let newData = []
  _.mapValues(theData, (dep) => {
    if (searchData(dep.deptName, term)) {
      newData.push(dep)
    }
  })
  return newData
}

function searchData (dataStr, term) {
  let reg = new RegExp('[a-zA-Z0-9\\- ]')
  if (reg.test(term)) {
    term = term.toUpperCase()
  }
  if (dataStr.indexOf(term) > -1 || convertPinyin(dataStr).toUpperCase().indexOf(term) > -1 || convertPinyinFirst(dataStr).indexOf(term) > -1) {
    return true
  } else {
    return false
  }
}
