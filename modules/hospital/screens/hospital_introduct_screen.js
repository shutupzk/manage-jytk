import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERTYPE} from 'config'
import {HOSPITALINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryHospitals, showPrompt, createHospital, updateHospital } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem, HospitalDetailModal} from '../components'


class HospitalIntroScreen extends Component {
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
		let hospital = this.props.hospital
		console.log('--------this.props', this.props)
    return (
      <div>
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加医院</button>
				</article>
				<HospitalDetailModal selectedData={this.state.selectedHospital}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={HOSPITALINFO.hospitalInfo_list_title}
					modalType={this.state.modalType}
					newsGroups={this.props.newsGroups}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={HOSPITALINFO.hospitalInfo_list_title} />
				{
					hospital && hospital.length > 0 ?
						hospital.map((hospitalItem, iKey) => {
							return <HospitalListItem data={hospitalItem} key={iKey} index={iKey}
							 titleInfo={HOSPITALINFO.hospitalInfo_list_title}
							 page='intro'
							 clickShowModal={(data, modalType) => {this.setState({selectedHospital: data, modalType: modalType, showModal: true})}} />
						})
					: 'no data'
				}
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    news: state.news.data.news,
    loading: state.news.loading,
		error: state.news.error,
		hospital: state.hospital.data,
		newsGroups: state.news.data.newsGroups
  }
}

export default connect(mapStateToProps, { queryHospitals, showPrompt, createHospital, updateHospital })(HospitalIntroScreen)
