import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// import localforage from 'localforage'
import Router from 'next/router'
import localforage from 'localforage'

// import SearchBar from '../components/search_bar'
import DepartmentList from '../../hospital/components/department_list'
import { signin, queryUser, queryPatients, queryDepartments, selectDepartment } from '../../../ducks'
import { isEmptyObject, convertPinyin, convertPinyinFirst, replaceSearchKey } from '../../../utils'
import {Loading, ErrCard, RequireLoginCard, theme, Modal, ModalHeader, ModalFooter} from 'components'

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
    // this.props.url.push(href)
  }
  getDepartments () {
    this.props.queryDepartments(this.props.client)
  }
  searchDept (theData, term) {
    this.setState({searchFlag: true, searchResult: filterData(theData, term)})
  }
  renderModal () {
    let modalHtml
    modalHtml = <Modal showModalState={this.state.showTipModal || this.state.showFilterModal}>
      <ModalHeader classChild='modalheaderTip'>挂号须知</ModalHeader>
      <div style={{padding: 20, color: theme.fontcolor}}>
        <p>尊敬的患者：</p>
        <p>您好，如果您交费后有退费要求时，应根据不同的退费情况提供所需单据。</p>
        <p>1.退检查、治疗、化验、CT、核磁等费用时需具备：</p>
        <p>(1)由医生开出的退款凭证；</p>
        <p>(2)盖过收费章的原交费单。</p>
        <p>2.退未取药的药费处方需具备：</p>
        <p>(1)原申请单或处方单。</p>
        <p>谢谢您的合作！</p>
      </div>
      <ModalFooter>
        <button className='modalBtn modalOnlyBtn' onClick={(e) => { this.setState({showTipModal: false}) }}>确定</button>
      </ModalFooter>
    </Modal>
    return modalHtml
  }
  render () {
    let department = this.props.departments
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
    if (!isEmptyObject(department)) {
      let deps = []
      _.mapValues(department, function (dep) {
        deps.push(dep)
      })
      if (this.state.searchFlag) {
        deps = this.state.searchResult
      }
      return (
        <div>
          {this.renderModal()}
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
      return <div>no department</div>
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
  return {
    token: state.user.data.token,
    user: state.user.data,
    patients: state.patients.data,
    departments: state.departments.data,
    loading: state.departments.loading || state.user.loading,
    error: state.departments.error || state.user.error
  }
}
export default connect(mapStateToProps, { signin, queryUser, queryPatients, queryDepartments, selectDepartment })(AppointmentDepartmentListScreen)

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
