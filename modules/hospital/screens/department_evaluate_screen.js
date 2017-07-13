import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import moment from 'moment'
import {queryDepartmentDetail} from '../../../ducks'
import { isEmptyObject } from '../../../utils'
import {Loading, ErrCard, NoDataCard, theme} from 'components'
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
        <ul className='flex tb-flex'>
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
            list-style: none;
            width: 18px;
            height: 18px;
            background-image: url(/static/icons/collect.png);
            background-size: 18px;
            margin-right: 3px;
          }
          ul li a {
            display: block;
            width: 100%;
            text-indent: -9999px;
            outline: none;
            overflow: hidden;
          }
          ul li.light {
            background-image: url(/static/icons/collected.png)
          }
        `}</style>
      </div>
    )
  }
  render () {
    if (this.props.loading) {
      return (
        <div>
          <h1><Loading showLoading={true} /></h1>
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <h1><ErrCard /></h1>
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
                <div key={evaluate.id} style={{background: '#fff', padding: '10px 15px', borderBottom: '1px solid #fff', borderColor: theme.bordercolor}}>
                  <div style={{color: theme.mainfontcolor, padding: '2px 0 10px'}}>
                    {evaluate.user.name}
                    <span style={{float: 'right', color: theme.nfontcolor}}>{moment(evaluate.createdAt).format('YYYY-MM-DD')}</span>
                  </div>
                  <div style={{display: 'flex', fontSize: 14, color: theme.nfontcolor}}>
                    <div style={{width: '50%'}} className='flex tb-flex'>
                      <span style={{color: theme.nfontcolor, marginRight: theme.tbmargin}}>技术水平</span>
                      {this.renderStar(evaluate.technologyScore)}
                    </div>
                    <div style={{width: '50%'}} className='flex tb-flex'>
                      <span style={{color: theme.nfontcolor, marginRight: theme.tbmargin}}>候诊秩序</span>
                      {this.renderStar(evaluate.orderlyScore)}
                    </div>
                  </div>
                  <div style={{color: theme.mainfontcolor, lineHeight: '24px', padding: '6px 0 6px'}}>{evaluate.advice}</div>
                </div>
              )
            }) : <NoDataCard tip='还没有相关内容哦' />
          }
        </div>
        <div className='fullWidthFixed'>
          <button
            onClick={() => { Router.push('/hospital/departments/add_department_evaluate?departmentId=' + departmentId) }}
            className='fullWidthBtn fullWidthBtnMain'
            style={{width: '100%'}}
          >我要评价</button>
        </div>
        <style jsx>{`
        `}</style>
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
