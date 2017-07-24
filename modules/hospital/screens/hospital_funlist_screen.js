import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading} from 'components'
import {ORDERTYPE} from 'config'
import {HOSPITALINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryNews, queryHospitals,queryNewGroups, showPrompt, createNews, updateNews } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem, HospitalDetailModal} from '../components'


class HospitalFunListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			showModal: false,
			selectedNews: {},
			modalType: '', // add\modify\delete
			isfilterkeyword: false
    }
  }

  componentWillMount() {
		this.props.queryNews(this.props.client)
		this.props.queryNewGroups(this.props.client)
  }
	
	async clickModalOk(data, modalType, values) {
		let error;
		if (modalType === 'modify') {
			values.id = this.state.selectedNews.id
			error = await this.props.updateNews(this.props.client, values)
		}
		else if (modalType === 'add') {
			error = await this.props.createNews(this.props.client, values)
		}
		if (error) {
			this.onHide();
			this.props.showPrompt({text: error});
			// return
		}
		this.onHide();
		// await this.props.showPrompt('更新成功');
		await this.props.queryNews(this.props.client)
	}

	onHide() {
		this.setState({showModal: false, selectedNews: {}, modalType: ''})
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
		const news = [
			{funName: '预约挂号', isFun: true, funCode: '0001'},
			{funName: '排队叫号', isFun: true, funCode: '0002'},
			{funName: '门诊缴费', isFun: true, funCode: '0003'},
			{funName: '住院服务', isFun: true, funCode: '0004'}
		]
		console.log('--------this.props', this.props)
    return (
      <div>
				{/* <article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => this.setState({showModal: true, modalType: 'add'})}>添加医院</button>
				</article> */}
				<HospitalDetailModal selectedNews={this.state.selectedNews}
					showModal={this.state.showModal}
					onHide={() => this.onHide()}
					titleInfo={HOSPITALINFO.hospitalFun_list_title}
					modalType={this.state.modalType}
					newsGroups={this.props.newsGroups}
					clickModalOk={(data, modalType, values) => this.clickModalOk(data, modalType, values)} />
				<ListTitle data={HOSPITALINFO.hospitalFun_list_title} />
				{
					news && news.length > 0 ?
						news.map((news, iKey) => {
							return <HospitalListItem data={news} index={iKey}
							 titleInfo={HOSPITALINFO.hospitalFun_list_title}
							 page='fun'
							 clickShowModal={(data, modalType) => {this.setState({selectedNews: data, modalType: modalType, showModal: true})}} />
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

export default connect(mapStateToProps, { queryNews, queryHospitals, queryNewGroups, showPrompt, createNews, updateNews })(HospitalFunListScreen)
