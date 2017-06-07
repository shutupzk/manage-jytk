
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import {queryDepartmentDetail} from '../../../ducks'
class DepartmentDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.toDetail = false
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
        <div className='container'>error...</div>
      )
    }
    if (this.props.loading) {
      return (
        <div className='container'>loading...</div>
      )
    }
    let evaluates = department.departmentEvaluates ? department.departmentEvaluates.slice(0, 3) : []
    let goEvaluateUrl = '/hospital/departments/evaluate_list?departmentId=' + departmentId
    return (
      <div className='container'>
        <div style={{backgroundColor: '#eee'}}>
          <div style={{backgroundColor: '#eee'}}>
            <div style={{backgroundColor: '#fff', marginBottom: 10, height: 30}}>
              <div style={styles.titleText}>{department.deptName}</div>
              <div style={styles.titleTypeText}>{department.features}</div>
            </div>
            <div style={{backgroundColor: '#fff', marginBottom: 10, height: 120, overflow: 'auto'}}>
              <div style={styles.commonText}>
                科室介绍
              </div>
              <div style={styles.contentText}>
                {department.description}
              </div>
            </div>
            <div style={{backgroundColor: '#fff', marginBottom: 10, height: 120, overflow: 'auto'}}>
              <div style={styles.commonText}>
                特色诊疗
              </div>
              <div style={styles.contentText}>
                神经外科（Neurosurgery）是外科学中的一个分支，是在外科学以手术为主要治疗手段的基础上，应用独特的神经外科学研究方法，研究人体神经系统，如脑、脊髓和周围神经系统，以及与之神经外科（Neurosurgery）是外科学中的一个分支，是在外科学以手术为主要治疗手段的基础上，应用独特的神经外科学研究方法，研究人体神经系统，如脑、脊髓和周围神经系统。。。
            </div>
            </div>
            <div style={{backgroundColor: '#fff'}}>
              <div style={styles.commonText}>
                科室评价
                <Link href={goEvaluateUrl}><a style={{float: 'right'}}>更多>></a></Link>
              </div>
              <div style={styles.contentText}>
                <ul style={{padding: 0, margin: 0}}>
                  {
                    evaluates.length > 0 ? evaluates.map((evaluate) => {
                      return (
                        <li style={{borderBottom: 'solid 1px #dddddd',marginBottom: 5}}>
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

const styles = {
  containerStyle: {
    margin: 0
  },
  titleStyle: {
    alignSelf: 'flex-start',
    fontSize: 15
  },
  commonText: {
    marginBottom: 10,
    fontSize: 15
    // lineHeight: 18
  },
  contentText: {
    fontSize: 14
  }
}
export default connect(mapStateToProps, {queryDepartmentDetail})(DepartmentDetailScreen)
