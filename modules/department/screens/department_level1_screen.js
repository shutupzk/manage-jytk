import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERTYPE} from 'config'
import {DEPARTMENTINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
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
			isfilterkeyword: false
    }
  }

  componentWillMount() {
		this.props.queryDepartments(this.props.client)
		this.props.queryHospitals(this.props.client)
  }

  filterCard(departments) {
		let newdepartments = departments;
		const {keyword, isfilterkeyword} = this.state;
		if (isfilterkeyword && keyword) {
			newdepartments = departments.filter((item) => item.deptSn === keyword || item.deptName === keyword)
			// this.setState({
				// isfilterkeyword: false
			// })
		}
    return newdepartments
	}
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (modalType === 'modify') {
			values.id = this.state.selectedDepartment.id
			error = await this.props.updateDepartment(this.props.client, values)
		}
		else if (modalType === 'add') {
			values.hospitalId = this.props.hospital && this.props.hospital[0] && this.props.hospital[0].id
			error = await this.props.createDepartment(this.props.client, values)
		}
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
		console.log('--------depar', departments)
    return (
      <div>
				{/* <TopFilterCard status={this.state.status} changeStatus={(status) => {this.setState({status: status})}}
          changeKeyword={(keyword) => {this.setState({keyword: keyword})}}
					clickfilter={() => {this.setState({isfilterkeyword: true})}}
					placeholder='科室名称／科室编码'
          data={ORDERTYPE}
					hideSelectType
					hideSeniorSoso /> */}
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加科室</button>
				</article>
				<DepartmentDetailModal selectedDepartment={this.state.selectedDepartment}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={DEPARTMENTINFO.department_list_title1}
					modalType={this.state.modalType}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={DEPARTMENTINFO.department_list_title1} />
				{
					departments && departments.length > 0 ?
						departments.map((department, iKey) => {
							return <DepartmentListItem data={department} key={iKey} index={iKey}
							 titleInfo={DEPARTMENTINFO.department_list_title1}
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
    departments: state.department.data,
    loading: state.department.loading,
		error: state.department.error,
		hospital: state.hospital.data
  }
}

export default connect(mapStateToProps, { queryDepartments, showPrompt, updateDepartment, createDepartment, queryHospitals })(DepartmentLevel1Screen)
