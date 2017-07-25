import React, { Component } from 'react'
// import { Router } from '../../../routes'
import _ from 'lodash'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERTYPE} from 'config'
import {DEPARTMENTINFO} from '../config'
import { ListTitle} from 'modules/common/components'
import { queryDepartments, showPrompt, updateDepartment } from '../../../ducks'
import { connect } from 'react-redux'
import {DepartmentListItem, DepartmentDetailModal, DepartmentFilterCard} from '../components'


class DepartmentRecommandScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			showModal: false,
			selectedDepartment: {},
			modalType: '', // add\modify\delete
			isfilterkeyword: false,
			status: ''
    }
  }

  componentWillMount() {
    this.props.queryDepartments(this.props.client)
	}
	
  filterCard(departments) {
		console.log('------departments', departments)
    if (!isEmptyObject(departments)) {
      let newdepartments = []
      _.mapValues(departments, function (dep) {
        newdepartments.push(dep)
      })
			const curstatus = this.state.status || (departments && departments[0] && departments[0].id);
			newdepartments = (departments.constructor() !== {}) && departments.filter((item) => item.hot === true)
			return newdepartments
    }
	}
	
	async clickModalOk(data, modalType, values) {
		values.id = this.state.selectedDepartment.id
		const error = await this.props.updateDepartment(this.props.client, values)
		if (error) {
			this.onHide();
			this.props.showPrompt({text: error});
			// return
		}
		this.onHide();
		// await this.props.showPrompt('更新成功');
		await this.props.queryDepartments(this.props.client)
	}

	onHide() {
		this.setState({showModal: false, selectedDepartment: {}, modalType: ''})
	}

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		if (this.props.error) {
			this.props.showPrompt(this.props.error)
			// return console.log(this.props.error)
			return <div>{this.props.error}</div>
		}
		let departments = this.filterCard(this.props.departments)
    return (
      <div>
				{/* <DepartmentFilterCard status={this.state.status}
					changeStatus={(status) => {this.setState({status: status})}}
          changeKeyword={(keyword) => {this.setState({keyword: keyword})}}
					clickfilter={() => {this.setState({isfilterkeyword: true})}}
					placeholder='科室名称／科室编码'
          data={this.props.departments}
					hideSeniorSoso /> */}
				{/* <article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加科室</button>
				</article> */}
				<DepartmentDetailModal selectedDepartment={this.state.selectedDepartment}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={DEPARTMENTINFO.department_list_title2}
					modalType={this.state.modalType}
					recommandPage
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={DEPARTMENTINFO.department_list_title2} />
				{
					departments && departments.length > 0 ?
						departments.map((department, iKey) => {
							return <DepartmentListItem data={department} key={iKey} index={iKey}
							 titleInfo={DEPARTMENTINFO.department_list_title2}
							 clickShowModal={(data, modalType) => {this.setState({selectedDepartment: data, modalType: modalType, showModal: true})}} />
						})
					: 'no data'
				}
      </div>
    )
  }
}


function isEmptyObject (obj) {
	for (let n in obj) { return false }
	return true
}
function mapStateToProps (state) {
	return {
		department: state.departments
	}
}

function mapStateToProps (state) {
  return {
    departments: state.department.data,
    loading: state.department.loading,
    error: state.department.error
  }
}

export default connect(mapStateToProps, { queryDepartments, showPrompt, updateDepartment })(DepartmentRecommandScreen)
