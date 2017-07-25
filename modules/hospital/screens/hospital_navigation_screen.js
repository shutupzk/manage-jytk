import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERTYPE} from 'config'
import {HOSPITALINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryHospitals, showPrompt, createHospital, updateHospital, queryBuildings } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem, HospitalDetailModal} from '../components'


class HospitalNavigationScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			showModal: false,
			selectedHospital: {},
			modalType: '', // add\modify\delete
			isfilterkeyword: false
    }
  }

  componentWillMount() {
		this.props.queryHospitals(this.props.client)
		this.props.queryBuildings(this.props.client)
  }
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (modalType === 'modify') {
			values.id = this.state.selectedHospital.id
			error = await this.props.updateHospital(this.props.client, values)
		}
		else if (modalType === 'add') {
			error = await this.props.createHospital(this.props.client, values)
		}
		if (error) {
			this.onHide();
			this.props.showPrompt({text: error});
			// return
		}
		this.onHide();
		// await this.props.showPrompt('更新成功');
		await this.props.queryHospitals(this.props.client)
	}

	onHide() {
		this.setState({showModal: false, selectedHospital: {}, modalType: ''})
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
		let building = this.props.building
		console.log('--------this.props', this.props)
    return (
      <div>
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => Router.push('/hospital/add_hospital_navigation')}>添加来院导航</button>
				</article>
				 <HospitalDetailModal selectedHospital={this.state.selectedHospital}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={HOSPITALINFO.hospitalNav_list_title}
					modalType={this.state.modalType}
					newsGroups={this.props.newsGroups}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={HOSPITALINFO.hospitalNav_list_title} />
				{
					building && building.length > 0 ?
						building.map((buildingItem, iKey) => {
							return <HospitalListItem data={buildingItem} key={iKey} index={iKey}
							 titleInfo={HOSPITALINFO.hospitalNav_list_title}
							 page='navi'
							 clickGoDetailPage={(data) => {Router.push('/hospital/hospital_navigation_detail?id='+data.id)}} />
						})
					: 'no data'
				} 
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    building: state.buildings.building,
    loading: state.news.loading,
		error: state.news.error,
		hospital: state.hospital.data,
		newsGroups: state.news.data.newsGroups
  }
}

export default connect(mapStateToProps, { queryHospitals, showPrompt, createHospital, updateHospital, queryBuildings })(HospitalNavigationScreen)
