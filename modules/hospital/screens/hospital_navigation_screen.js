import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, PageCard} from 'components'
import {ORDERTYPE} from 'config'
import {HOSPITALINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryHospitals, showPrompt, createHospital, updateHospital, queryBuildings } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem} from '../components'


class HospitalNavigationScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
			keyword: '',
			showModal: false,
			selectedHospital: {},
			modalType: '', // add\modify\delete
			page: 1
    }
  }

  componentWillMount() {
		this.props.queryHospitals(this.props.client)
		this.queryBuildings()
	}

	async queryBuildings() {
		let error = await this.props.queryBuildings(this.props.client, {limit: 10, skip: (this.state.page - 1) * 10})
    if (error) {
      this.props.showPrompt({text: error})
      return
    }
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
        <PageCard data={building} page={this.state.page}
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
              this.queryBuildings()
            })
          }} />
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
