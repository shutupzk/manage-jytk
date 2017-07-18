import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import {theme} from 'components'
import SearchBar from '../components/search_bar'
import SearchDoctorList from '../components/search_doctor_list'
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
    this.props.searchDoctors(this.props.client, {doctorName: term})
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
        <div style={{backgroundColor: '#e6e6e6', padding: '10px 15px'}}>
          <div style={{background: '#fff', width: '100%', borderRadius: 6, justifyContent: 'space-between', lineHeight: '36px'}}
            className='flex tb-flex'>
            <SearchBar searchDep={(term) => { this.searchDepOrDoc(term) }} />
            <div style={{padding: '0 15px', background: theme.maincolor, borderRadius: '0 6px 6px 0'}} onClick={() => {
              this.props.removeSearchDepIds()
              this.props.removeSearchDocIds()
              window.history.back()
            }}><a style={{color: '#fff'}}>取消</a></div>
          </div>
        </div>
        {
          deps && deps.length > 0
          ? <div style={{padding: '10px 15px'}}>
            <div style={{padding: 10}}>科室</div>
            <DepartmentList deps={deps} selectDepartment={(dep) => { this.selectDepartment(dep) }} searchKey={(text) => { return replaceSearchKey(text, this.state.term) }} />
          </div> : ''
        }
        {
          docs && docs.length > 0
          ? <div style={{ padding: '10px 15px'}}>
            <div style={{padding: 10}}>医生</div>
            <SearchDoctorList doctors={docs} selectDoctor={(docId) => { this.selectDoctor(docId) }} searchKey={(text) => { return replaceSearchKey(text, this.state.term) }} />
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
