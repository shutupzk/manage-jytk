import React, { Component } from 'react'
// import { Router } from '../../../routes'
import _ from 'lodash'
import Router from 'next/router'
import {theme, Prompt, Loading, FilterCard, SelectFilterCard, KeywordCard, PageCard} from 'components'
import {isArray, fuzzyQuery} from 'utils'
import {DEPARTMENTINFO} from '../config'
import { ListTitle} from 'modules/common/components'
import { queryDepartments, showPrompt, updateDepartment } from '../../../ducks'
import { connect } from 'react-redux'
import {DepartmentListItem, DepartmentDetailModal} from '../components'


class DepartmentIsAppointScreen extends Component {
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
	}

	async queryDepartments() {
		let error = await this.props.queryDepartments(this.props.client, {limit: 10, skip: (this.state.page - 1) * 10})
    if (error) {
      this.props.showPrompt({text: error})
      return
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
		this.queryDepartments()
	}

	filterCard(allDepartments) {
		let filterAllDepartments = allDepartments.filter((department) => {return department.isAppointment === true})
		if (this.state.keyword) {
			filterAllDepartments = fuzzyQuery(filterAllDepartments, this.state.keyword, ['deptSn', 'deptName', 'description'])
		}
		return filterAllDepartments
	}

	onHide() {
		this.setState({showModal: false, selectedDepartment: {}, modalType: ''})
	}

  render () {
    if (this.props.loading) {
      return <Loading showLoading />
		}
		let departments = this.filterCard(isArray(this.props.departments) ? this.props.departments : [])
    return (
      <div>
				<FilterCard>
					<KeywordCard
						config={{placeholder: '科室编码／科室名称／科室介绍'}}
						clickfilter={(keyword) => {this.setState({keyword: keyword, page: 1}, () => this.queryDepartments())}} />
				</FilterCard>
				<DepartmentDetailModal selectedDepartment={this.state.selectedDepartment}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={DEPARTMENTINFO.department_list_title2}
					modalType={this.state.modalType}
					config={[
						{title: '所属医院', selectData: isArray(this.props.hospitals) ? this.props.hospitals : [], valueKey: 'id', titleKey: 'hospitalName'},
						{title: '父级科室', selectData: isArray(this.props.departmentsLevel1) ? this.props.departmentsLevel1 : [], valueKey: 'id', titleKey: 'deptName'}
					]}
					detailPage
					isAppointPage
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={DEPARTMENTINFO.department_list_title2} />
				{
					departments && departments.length > 0 ?
						departments.map((department, iKey) => {
							return <DepartmentListItem data={department} key={iKey} index={iKey}
							 titleInfo={DEPARTMENTINFO.department_list_title2}
							 page={'level2'}
							 clickShowModal={(data, modalType) => {this.setState({selectedDepartment: data, modalType: modalType, showModal: true})}} />
						})
					: 'no data'
				}
        <PageCard data={isArray(departments) ? departments : []} page={this.state.page}
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
    departments: state.department.data.departments,
    loading: state.department.loading,
		error: state.department.error,
		hospitals: state.hospital.data,
		departmentsLevel1: state.department.data.departmentsLevel1,
  }
}

export default connect(mapStateToProps, { queryDepartments, showPrompt, updateDepartment })(DepartmentIsAppointScreen)
