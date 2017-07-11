
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import {queryDepartmentDetail} from '../../../ducks'
import { replaceStr } from '../../../utils'
import {Loading, ErrCard} from 'components'
class DepartmentDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.toDetail = false
    this.state = {
      descriptionAll: false,
      featuresAll: false
    }
  }
  static async getInitialProps (context) {
    return {usr: 'baek'}
  }

  componentWillMount () {
    let departmentId = this.props.url.query.departmentId
    let departments = this.props.department
    this.props.queryDepartmentDetail(this.props.client, {departmentId, departments})
  }

  render () {
    let departmentId = this.props.departmentId || this.props.url.query.departmentId
    var department = this.props.department[departmentId]
    if (this.props.error) {
      return (
        <div className='container'><ErrCard /></div>
      )
    }
    if (this.props.loading) {
      return (
        <div className='container'><Loading showLoading={true} /></div>
      )
    }
    let evaluates = department.departmentEvaluates ? department.departmentEvaluates.slice(0, 3) : []
    let goEvaluateUrl = '/hospital/departments/evaluate_list?departmentId=' + departmentId
    const description = department.description || 'Neurosurgery' // '神经外科（Neurosurgery）是外科学中的一个分支，是在外科学以手术为主要治疗手段的基础上，应用独特的神经外科学研究方法，研究人体神经系统，如脑、脊髓和周围神经系统，以及与之神经外科（Neurosurgery）是外科学中的一个分支，是在外科学以手术为主要治疗手段的基础上，应用独特的神经外科学研究方法，研究人体神经系统，如脑、脊髓和周围神经系统。'
    const features = department.features || '神经外科（Neurosurgery）是外科学中的一个分支，是在外科学以手术为主要治疗手段的基础上，应用独特的神经外科学研究方法，研究人体神经系统，如脑、脊髓和周围神经系统，以及与之神经外科（Neurosurgery）是外科学中的一个分支，是在外科学以手术为主要治疗手段的基础上，应用独特的神经外科学研究方法，研究人体神经系统，如脑、脊髓和周围神经系统。'
    return (
      <div>
        <div>
          <div>
            <div style={{backgroundColor: '#fff', padding: '0 15px', lineHeight: '40px', borderBottom: '1px solid #fff', borderColor: theme.bordercolor}}>
              <span style={{fontSize: 18, color: theme.mainfontcolor}}>{department.deptName}</span>
              <span style={{fontSize: theme.nfontsize, marginLeft: 6, color: theme.nfontcolor}}>{ department.position || '病理医学部'}</span>
            </div>
            <div style={{backgroundColor: '#fff',  margin: '10px 0px', overflow: 'auto', color: theme.fontcolor, fontSize: 14}}>
              <div style={{fontSize: 15, padding: '0 15px', color: theme.mainfontcolor, lineHeight: '40px', display: 'flex', borderTop: '1px solid #fff', borderBottom: '1px solid #fff', borderColor: theme.bordercolor}}>
                科室介绍
              </div>
              <div style={{padding: '10px 15px', lineHeight: '24px'}}>
                {
                  this.state.descriptionAll ? description : replaceStr(description, 100, description.length, '...')
                }
              </div>
              { description.length > 100 ? <div style={{color: '#3CA0FF', textAlign: 'right', marginBottom: 10}} onClick={() => { this.setState({descriptionAll: !this.state.descriptionAll}) }}>{this.state.descriptionAll ? '收起▲' : '展开▼'}</div> : '' }
            </div>
            <div style={{backgroundColor: '#fff', marginBottom: 10, padding: '10px 15px', overflow: 'auto'}}>
              <div style={{fontSize: 15, marginBottom: 15, display: 'flex'}}>
                <div style={{backgroundColor: '#3CA0FF', width: 5, marginRight: 5, height: 18}} />
                特色诊疗
              </div>
              <div>
                <div style={{minHeight: 50, fontSize: 14}}>
                  {
                    this.state.featuresAll ? features : replaceStr(features, 100, features.length, '...')
                  }
                </div>
                { features.length > 100 ? <div style={{color: '#3CA0FF', textAlign: 'right', marginBottom: 10}} onClick={() => { this.setState({featuresAll: !this.state.featuresAll}) }}>{this.state.featuresAll ? '收起▲' : '展开▼'}</div> : '' }
              </div>
            </div>
            <div style={{backgroundColor: '#fff', padding: '10px 15px'}}>
              <div style={{fontSize: 15, marginBottom: 15, display: 'flex'}}>
                <div style={{flex: 1, display: 'flex'}}>
                  <div style={{backgroundColor: '#3CA0FF', width: 5, marginRight: 5, height: 18}} />
                  科室评价
                </div>
                <Link href={goEvaluateUrl}><a style={{textAlign: 'right', color: '#D4D4D4', fontSize: 13, flex: 1}}>更多>></a></Link>
              </div>
              <div style={{fontSize: 14}}>
                <ul style={{padding: 0, margin: 0}}>
                  {
                    evaluates.length > 0 ? evaluates.map((evaluate) => {
                      return (
                        <li style={{borderBottom: 'solid 1px #dddddd', marginBottom: 5}} key={evaluate.id}>
                          <div>评价人:{evaluate.user.name}</div>
                          <div>评价内容:{evaluate.advice}</div>
                        </li>
                      )
                    }) : '暂无评价'
                  }
                </ul>
              </div>
            </div>
          </div>
          {/*<div style={{position: 'absolute', bottom: '15px', width: '90%', height: '40px'}}>
            <button style={{width: '100%', display: 'block', backgroundColor: '#3CA0FF', height: '40px', borderRadius: '10px', fontSize: 16}}>我要评价</button>
          </div>*/}
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    department: state.departments.data,
    departmentId: state.departments.selectId,
    error: state.departments.error,
    loading: state.departments.loading
  }
}

export default connect(mapStateToProps, {queryDepartmentDetail})(DepartmentDetailScreen)
