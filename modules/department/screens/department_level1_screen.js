import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard, PageCard} from 'components'
import {isArray, fuzzyQuery} from 'utils'
import {HOSPITALINFO} from 'config'
import {DEPARTMENTINFO} from '../config'
import {ListTitle} from 'modules/common/components'
import { queryDepartments, showPrompt, updateDepartment, createDepartment, queryHospitals } from '../../../ducks'
import { connect } from 'react-redux'
import {DepartmentListItem, DepartmentDetailModal} from '../components'


class DepartmentLevel1Screen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			showModal: false,
			selectedDepartment: {},
			modalType: '', // add\modify\delete
			page: 1
    }
  }

  componentWillMount() {
		this.queryDepartments()
		this.props.queryHospitals(this.props.client)
  }

	async queryDepartments() {
		let error = await this.props.queryDepartments(this.props.client, {limit: 10, skip: (this.state.page - 1) * 10})
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
	}
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (modalType === 'modify') {
			values.id = this.state.selectedDepartment.id
			values.level = HOSPITALINFO && HOSPITALINFO.department_level && HOSPITALINFO.department_level === 1 ? '2' : '1'
			error = await this.props.updateDepartment(this.props.client, values)
		}
		else if (modalType === 'add') {
			if (!values.deptSn) {this.props.showPrompt({text: '科室编码必填'}); return;}
			if (!values.deptName) {this.props.showPrompt({text: '科室名称必填'}); return;}
			if (!values.hospitalId) {this.props.showPrompt({text: '所属医院必选'}); return;}
			values.level = HOSPITALINFO && HOSPITALINFO.department_level && HOSPITALINFO.department_level === 1 ? '2' : '1'
			error = await this.props.createDepartment(this.props.client, values)
			this.setState({page: 1})
		}
		if (error) {
			this.onHide();
			this.props.showPrompt({text: error});
			// return
		}
		this.onHide();
		this.queryDepartments()
	}

	onHide() {
		this.setState({showModal: false, selectedDepartment: {}, modalType: ''})
	}

	filterCard(departmentsLevel1) {
		let filterlevelDepartments = departmentsLevel1
		console.log('--------depar10000', departmentsLevel1)
		if (this.state.keyword) {
			filterlevelDepartments = fuzzyQuery(filterlevelDepartments, this.state.keyword, ['deptSn', 'deptName'])
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
		let departmentsLevel1 = this.filterCard(this.props.departmentsLevel1)
		console.log('--------depar', departmentsLevel1)
    return (
      <div>
				<FilterCard>
					<KeywordCard
						config={{placeholder: '科室编码／科室名称'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword, page: 1}, () => {this.queryDepartments()})}} />
				</FilterCard>
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>
						{
							HOSPITALINFO && HOSPITALINFO.department_level && HOSPITALINFO.department_level === 1 ?
								'添加科室'
							: '添加一级科室'
						}</button>
				</article>
				<DepartmentDetailModal selectedDepartment={this.state.selectedDepartment}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={DEPARTMENTINFO.department_list_title1}
					modalType={this.state.modalType}
					config={[
						{title: '所属医院', selectData: isArray(this.props.hospitals) ? this.props.hospitals : [], valueKey: 'id', titleKey: 'hospitalName'},
						{title: '父级科室', selectData: isArray(this.props.departmentsLevel1) ? this.props.departmentsLevel1 : [], valueKey: 'id', titleKey: 'deptName'}
					]}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={DEPARTMENTINFO.department_list_title1} />
				{
					departmentsLevel1 && departmentsLevel1.length > 0 ?
						departmentsLevel1.map((department, iKey) => {
							return <DepartmentListItem data={department} key={iKey} index={iKey + ((this.state.page-1) * 10)}
							 titleInfo={DEPARTMENTINFO.department_list_title1}
							 page={'level1'}
							 clickShowModal={(data, modalType) => {this.setState({selectedDepartment: data, modalType: modalType, showModal: true})}} />
						})
					: 'no data'
				}
        <PageCard data={isArray(departmentsLevel1) ? departmentsLevel1 : []} page={this.state.page}
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
		hospitals: state.hospital.data
  }
}

export default connect(mapStateToProps, { queryDepartments, showPrompt, updateDepartment, createDepartment, queryHospitals })(DepartmentLevel1Screen)
