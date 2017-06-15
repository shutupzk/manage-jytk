import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'

import SearchBar from '../components/search_bar'
import DoctorList from '../../hospital/components/doctor_list'
import DepartmentList from '../../hospital/components/department_list'
import { selectDoctor, selectDepartment, searchDepartments, searchDoctors, removeSearchDepIds, removeSearchDocIds } from '../../../ducks'
import { replaceSearchKey } from '../../../utils'

class SearchScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      term: ''
    }
  }
  searchDepOrDoc (term) {
    this.setState({term: term})
    if (term === '') {
      term = '&%'
    }
    this.props.searchDepartments(this.props.client, {deptName: term})
  }
  selectDepartment (dep) {
    this.props.selectDepartment({departmentId: dep.id})
    var href = {pathname: '/appointment/doctor_list', query: {departmentId: dep.id}}
    Router.push(href)
  }
  selectDoctor (docId) {
    this.props.selectDoctor({doctorId: docId})
    Router.push('/profile/doctor_detail?doctorId=' + docId)
  }
  filterDeps () {
    let deps = []
    if (this.props.searchDepIds) {
      for (let depid of this.props.searchDepIds) {
        deps.push(this.props.departments[depid])
      }
    }
    return deps
  }
  filterDocs () {
    let docs = []
    if (this.props.searchDocIds) {
      for (let docid of this.props.searchDocIds) {
        docs.push(this.props.doctors[docid])
      }
    }
    return docs
  }
  render () {
    const deps = this.filterDeps(this.props.departments, this.props.searchDepIds)
    const docs = this.filterDocs(this.props.doctors, this.props.searchDocIds)
    return (
      <div>
        <div style={{display: 'flex', backgroundColor: '#fff', padding: '10px 20px'}}>
          <div style={{flex: 11}}><SearchBar searchDep={(term) => { this.searchDepOrDoc(term) }} /></div>
          <div style={{flex: 1, marginLeft: 20, padding: 10}} onClick={() => {
            this.props.removeSearchDepIds()
            this.props.removeSearchDocIds()
            window.history.back()
          }}><a style={{pading: '0px 10px'}}>取消</a></div>
        </div>
        {
          deps && deps.length > 0
          ? <div>
            <div style={{padding: 10}}>科室</div>
            <DepartmentList deps={deps} selectDepartment={(dep) => { this.selectDepartment(dep) }} searchKey={(text) => { return replaceSearchKey(text, this.state.term) }} />
          </div> : ''
        }
        {
          docs && docs.length > 0
          ? <div>
            <div style={{padding: 10}}>医生</div>
            <DoctorList doctors={docs} userId={''} toUrl={(docId) => { this.selectDoctor(docId) }} term={this.state.term} />
          </div> : ''
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    departments: state.departments.data,
    searchDepIds: state.departments.searchDepIds,
    doctors: state.doctors.data,
    searchDocIds: state.doctors.searchDocIds,
    loading: state.departments.loading || state.doctors.loading,
    error: state.departments.error || state.doctors.error
  }
}

export default connect(mapStateToProps, { selectDoctor, selectDepartment, searchDepartments, searchDoctors, removeSearchDepIds, removeSearchDocIds })(SearchScreen)
