import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import moment from 'moment'
import {queryDepartmentDetail} from '../../../ducks'
import { isEmptyObject } from '../../../utils'
class DepartmentEvaluateScreen extends Component {
  componentWillMount () {
    var departmentId = this.props.departmentId || this.props.url.query.departmentId
    if (isEmptyObject(this.props.departments)) {
      this.getDepartmentDetail(departmentId)
    }
  }

  getDepartmentDetail (departmentId) {
    this.props.queryDepartmentDetail(this.props.client, {departmentId, departments: this.props.departments})
  }
  renderStar (score) {
    return (
      <div>
        <ul>
          {
            [1, 2, 3, 4, 5].map((i) => {
              if (i > score) {
                return (
                  <li key={i}><a /></li>
                )
              } else {
                return (<li key={i} className='light'><a /></li>)
              }
            })
          }
        </ul>
        <style jsx>{`
          ul {
            padding-left: 0;
            overflow: hidden;
          }
          ul li {
            float: left;
            list-style: none;
            width: 27px;
            height: 27px;
            background: url(/static/icons/stars.gif)
          }
          ul li a {
            display: block;
            width: 100%;
            padding-top: 27px;
            overflow: hidden;
          }
          ul li.light {
            background-position: 0 -29px;
          }
        `}</style>
      </div>
    )
  }
  render () {
    if (this.props.loading) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <h1>error...</h1>
        </div>
      )
    }
    var departmentId = this.props.departmentId || this.props.url.query.departmentId
    const department = this.props.departments[departmentId]
    const evaluates = department.departmentEvaluates
    const height = window.innerHeight - 70
    return (
      <div>
        <div style={{height: height, overflow: 'auto'}}>
          {
            evaluates.length > 0 ? evaluates.map((evaluate) => {
              return (
                <div key={evaluate.id} style={{backgroundColor: '#ffffff', padding: '10px 15px', marginBottom: 2}}>
                  <div style={{marginBottom: 5, color: '#505050'}}>{evaluate.user.name} <span style={{float: 'right'}}>{moment(evaluate.createdAt).format('YYYY-MM-DD')}</span></div>
                  <div style={{display: 'flex', fontSize: 14, color: '#505050'}}>
                    <div style={{width: '50%'}}>技术水平 {this.renderStar(evaluate.technologyScore)}</div>
                    <div>候诊秩序 {this.renderStar(evaluate.orderlyScore)}</div>
                  </div>
                  <div style={{color: '#505050'}}>{evaluate.advice}</div>
                </div>
              )
            }) : <div>暂无评价</div>
          }
        </div>
        <div style={{position: 'absolute', bottom: '15px', width: '90%', height: '40px', margin: '0px 20px'}}>
          <button
            onClick={() => { Router.push('/hospital/departments/add_department_evaluate?departmentId=' + departmentId) }}
            style={{width: '100%', display: 'block', backgroundColor: '#3CA0FF', height: '40px', borderRadius: '10px', fontSize: 16}}
          >我要评价</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    departments: state.departments.data,
    departmentId: state.departments.selectId,
    error: state.departments.error,
    loading: state.departments.loading
  }
}

export default connect(mapStateToProps, { queryDepartmentDetail })(DepartmentEvaluateScreen)
