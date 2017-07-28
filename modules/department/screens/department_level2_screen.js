import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard} from 'components'
import {ORDERTYPE} from 'config'
import {isArray, fuzzyQuery} from 'util'
import {DEPARTMENTINFO} from '../config'
import { ListTitle} from 'modules/common/components'
import { queryDepartments, showPrompt, updateDepartment, queryHospitals, createDepartment } from '../../../ducks'
import { connect } from 'react-redux'
import {DepartmentListItem, DepartmentDetailModal} from '../components'


class DepartmentLevel2Screen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			showModal: false,
			selectedDepartment: {},
			modalType: '', // add\modify\delete
			status: ''
    }
  }

  componentWillMount() {
		this.props.queryDepartments(this.props.client)
		this.props.queryHospitals(this.props.client)
  }
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (!values.parentId) {this.props.showPrompt({text: '一级科室必选'}); return;}
		if (modalType === 'modify') {
			values.id = this.state.selectedDepartment.id
			values.level = '2'
			console.log('------values', values)
			error = await this.props.updateDepartment(this.props.client, values)
		}
		else if (modalType === 'add') {
			if (!values.deptSn) {this.props.showPrompt({text: '科室编码必填'}); return;}
			if (!values.deptName) {this.props.showPrompt({text: '科室名称必填'}); return;}
			if (!values.hospitalId) {this.props.showPrompt({text: '所属医院必选'}); return;}
			values.level = '2'
			console.log('---add---values', values)
			error = await this.props.createDepartment(this.props.client, values)
		}
		if (error) {
			this.props.showPrompt({text: error});
			return
		}
		this.onHide();
		// await this.props.showPrompt('更新成功');
		await this.props.queryDepartments(this.props.client)
	}

	onHide() {
		this.setState({showModal: false, selectedDepartment: {}, modalType: ''})
	}

	filterCard(departmentsLevel2) {
		let filterlevelDepartments = departmentsLevel2
		if (this.state.keyword) {
			filterlevelDepartments = fuzzyQuery(filterlevelDepartments, this.state.keyword, ['deptSn', 'deptName', 'description'])
		}
		if (this.state.status) {
			filterlevelDepartments = filterlevelDepartments.filter((departmentItem) => {return (departmentItem.parent && departmentItem.parent.deptSn) === this.state.status})
		}
		return filterlevelDepartments
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
		let departmentsLevel2 = this.filterCard(this.props.departmentsLevel2)
    return (
      <div>
				<FilterCard>
					<SelectFilterCard
						data={isArray(this.props.departmentsLevel1) ? this.props.departmentsLevel1 : []}
						status={this.state.status}
						config= {{selectTitle: '请选择父级科室', valueKey: 'deptSn', titleKey: 'deptName'}}
						changeStatus={(status) => {this.setState({status: status})}} />
					<KeywordCard
						config={{placeholder: '科室编码／科室名称／科室介绍'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword})}} />
				</FilterCard>
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加二级科室</button>
				</article>
				<DepartmentDetailModal selectedDepartment={this.state.selectedDepartment}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={DEPARTMENTINFO.department_list_title2}
					modalType={this.state.modalType}
					config={[
						{title: '所属医院', selectData: isArray(this.props.hospitals) ? this.props.hospitals : [], valueKey: 'id', titleKey: 'hospitalName'},
						{title: '父级科室', selectData: isArray(this.props.departmentsLevel1) ? this.props.departmentsLevel1 : [], valueKey: 'id', titleKey: 'deptName'}
					]}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={DEPARTMENTINFO.department_list_title2 || []} />
				{
					departmentsLevel2 && departmentsLevel2.length > 0 ?
						departmentsLevel2.map((department, iKey) => {
							return <DepartmentListItem data={department} key={iKey} index={iKey}
							 titleInfo={DEPARTMENTINFO.department_list_title2}
							 page={'level2'}
							 clickShowModal={(data, modalType) => {this.setState({selectedDepartment: data, modalType: modalType, showModal: true})}} />
						})
					: 'no data'
				}
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    departmentsLevel1: state.department.data.departmentsLevel1,
    loading: state.department.loading,
		error: state.department.error,
		departmentsLevel2: state.department.data.departmentsLevel2,
		hospitals: state.hospital.data
  }
}

export default connect(mapStateToProps, { queryDepartments, showPrompt, updateDepartment, queryHospitals, createDepartment })(DepartmentLevel2Screen)
