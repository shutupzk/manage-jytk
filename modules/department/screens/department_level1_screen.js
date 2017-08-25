import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard, PageCard} from 'components'
import {isArray, fuzzyQuery} from 'utils'
import {HOSPITALINFO} from 'config'
import {DEPARTMENTINFO, BYSY_DEPARTMENTINFO} from '../config'
import {ListTitle} from 'modules/common/components'
import { queryDepartments, showPrompt, updateDepartment, createDepartment, queryHospitals, selectdepartment } from '../../../ducks'
import { connect } from 'react-redux'
import {DepartmentListItem, DepartmentDetailModal} from '../components'


const level = HOSPITALINFO && HOSPITALINFO.department_level
const hosName = HOSPITALINFO && HOSPITALINFO.hospital_short_name
const title = hosName === 'beiyisanyuan' ? BYSY_DEPARTMENTINFO.department_list_title1 : DEPARTMENTINFO.department_list_title1
class DepartmentLevel1Screen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			showModal: false,
			modalType: '', // add\modify\delete
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
		let error = await this.props.queryDepartments(
			this.props.client,
			params
		)
    if (error) {
      this.props.showPrompt({text: error})
      return
		}
	}
	
	async clickModalOk(values) {
		const modalType = this.state.modalType
		let error;
		if (modalType === 'modify') {
			// values.id = this.props.selectedDepartment.id
			error = await this.props.updateDepartment(this.props.client, values)
		} else if (modalType === 'add') {
			if (!values.deptSn) {this.props.showPrompt({text: '科室编码必填'}); return;}
			if (!values.deptName) {this.props.showPrompt({text: '科室名称必填'}); return;}
			if (!values.hospitalId) {this.props.showPrompt({text: '所属医院必选'}); return;}
			error = await this.props.createDepartment(this.props.client, values)
			this.setState({page: 1})
		}
		if (error) {
			// this.onHide();
			this.props.showPrompt({text: error});
			return
		}
		// this.onHide();
		this.queryDepartments()
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
		if (this.props.error) {
			return <div>{this.props.error}</div>
		}
		let departmentsLevel1 = this.props.departmentsLevel1
    return (
      <div>
				<Loading showLoading={this.props.loading} />
				<FilterCard>
					<SelectFilterCard
						data={[{value: 'hot', title: '特色科室'}]}
						status={this.state.status}
						config= {{selectTitle: '全部类型', valueKey: 'value', titleKey: 'title'}}
						changeStatus={(status) => {
							this.setState({
								page: 1, status: status
							}, () => {
								this.queryDepartments()
							})}
						} />
					<KeywordCard
						config={{placeholder: '科室编码／科室名称', keyword: this.state.keyword}}
						clickfilter={(keyword) => {this.setState({keyword: keyword, page: 1}, () => {this.queryDepartments()})}} />
				</FilterCard>
				{
					hosName === 'beiyisanyuan' ?
						''
					:
						<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
							<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
								onClick={() => this.setState({showModal: true, modalType: 'add'})}>
								{
									level === 1 ?
										'添加科室'
									: '添加一级科室'
								}</button>
						</article>
				}
				<DepartmentDetailModal selectedDepartment={this.props.selectedDepartment}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={title}
					modalType={this.state.modalType}
					config={[
						{title: '所属医院', selectData: isArray(this.props.hospitals) ? this.props.hospitals : [], valueKey: 'id', titleKey: 'hospitalName'},
						{title: '父级科室', selectData: isArray(this.props.departmentsLevel1) ? this.props.departmentsLevel1 : [], valueKey: 'id', titleKey: 'deptName'}
					]}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={title} />
				{
					departmentsLevel1 && departmentsLevel1.length > 0 ?
						departmentsLevel1.map((department, iKey) => {
							return <DepartmentListItem data={department} key={iKey} index={iKey + ((this.state.page-1) * 10)}
							 titleInfo={title}
							 changeRecommnad={(data, value, key) => this.changeRecommnad(data, value, key)}
							 page={'level1'}
							 clickShowModal={(data, modalType) => {
								 this.props.selectdepartment({department: data})
								 this.setState({ modalType: modalType, showModal: true})}
							 } />
						})
					: 'no data'
				}
        <PageCard data={isArray(departmentsLevel1) ? departmentsLevel1 : []} page={this.state.page}
          clickPage={(type) => {
            const prevPage = parseInt(this.state.page, 10)
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
		hospitals: state.hospital.data,
		selectedDepartment: state.department.selectedDepartment
  }
}

export default connect(mapStateToProps, { queryDepartments, showPrompt, updateDepartment, createDepartment, queryHospitals, selectdepartment })(DepartmentLevel1Screen)
