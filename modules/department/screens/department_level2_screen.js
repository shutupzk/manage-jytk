import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard, PageCard} from 'components'
import {ORDERTYPE} from 'config'
import {isArray, fuzzyQuery} from 'utils'
import {DEPARTMENTINFO} from '../config'
import { ListTitle} from 'modules/common/components'
import { queryDepartments, showPrompt, updateDepartment, queryHospitals, createDepartment, selectdoctor } from '../../../ducks'
import { connect } from 'react-redux'
import {DepartmentListItem, DepartmentDetailModal} from '../components'


class DepartmentLevel2Screen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			showModal: false,
			modalType: '', // add\modify\delete
			status: '',
			page: 1
    }
  }

  componentWillMount() {
		this.queryDepartments()
		this.props.queryHospitals(this.props.client)
  }

	async queryDepartments() {
		let params = {limit: 10, skip: (this.state.page - 1) * 10, keyword: this.state.keyword}
		let status = this.state.status
		if (status === 'hot') {
			params = Object.assign({}, params, {hot: true})
		}
		let error = await this.props.queryDepartments(this.props.client, params)
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
	}
	
	async clickModalOk(values) {
		let error;
		if (!values.parentId) {this.props.showPrompt({text: '一级科室必选'}); return;}
		if (modalType === 'modify') {
			error = await this.props.updateDepartment(this.props.client, values)
		}
		else if (modalType === 'add') {
			if (!values.deptSn) {this.props.showPrompt({text: '科室编码必填'}); return;}
			if (!values.deptName) {this.props.showPrompt({text: '科室名称必填'}); return;}
			if (!values.hospitalId) {this.props.showPrompt({text: '所属医院必选'}); return;}
			values.level = '2'
			error = await this.props.createDepartment(this.props.client, values)
			this.setState({page: 1})
		}
		if (error) {
			this.props.showPrompt({text: error});
			return
		}
		// this.onHide();
		// await this.props.showPrompt('更新成功');
		await this.queryDepartments()
	}

	onHide() {
		this.props.selectdepartment({department: {}})
		this.setState({showModal: false, modalType: ''})
	}

	async changeRecommnad(data, value, key) {
		let error = await this.props.updateDepartment(this.props.client, {id: data.id, [key]: value})
		if (error) {
			this.props.showPrompt({text: error});
			return
		}
		this.queryDepartments()
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
		let departmentsLevel2 = this.props.departmentsLevel2
    return (
      <div>
				<FilterCard>
					<SelectFilterCard
						data={isArray(this.props.departmentsLevel1) ? this.props.departmentsLevel1 : []}
						status={this.state.status}
						config= {{selectTitle: '请选择父级科室', valueKey: 'deptSn', titleKey: 'deptName'}}
						changeStatus={(status) => {this.setState({status: status, page: 1}, () => this.queryDepartments())}} />
					<KeywordCard
						config={{placeholder: '科室编码／科室名称'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword, page: 1}, () => this.queryDepartments())}} />
				</FilterCard>
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加二级科室</button>
				</article>
				<DepartmentDetailModal selectedDepartment={this.props.selectedDepartment}
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
							return <DepartmentListItem data={department} key={iKey} index={iKey + ((this.state.page -1) * 10)}
							 titleInfo={DEPARTMENTINFO.department_list_title2}
							 changeRecommnad={(data, value, key) => this.changeRecommnad(data, value, key)}
							 page={'level2'}
							 clickShowModal={(data, modalType) => {
								 this.props.selectdepartment({department: data})
								 this.setState({modalType: modalType, showModal: true})}} />
						})
					: 'no data'
				}
        <PageCard data={isArray(departmentsLevel2) ? departmentsLevel2 : []} page={this.state.page}
          clickPage={(type) => {
            const prevPage = this.state.page
            let curPage
            if (type === 'prev') {
              curPage = prevPage - 1
            } else if (type === 'next') {
              curPage = prevPage + 1
            } else {
              curPage = type
            }
            this.setState({
              page: curPage
            }, () => {
              this.queryDepartments()
            })
          }} />
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
		hospitals: state.hospital.data,
		selectedDepartment: state.department.selectedDepartment
  }
}

export default connect(mapStateToProps, { queryDepartments, showPrompt, updateDepartment, queryHospitals, createDepartment, selectdoctor })(DepartmentLevel2Screen)
