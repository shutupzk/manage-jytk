import React, { Component } from 'react'
// import { Router } from '../../../routes'
import Router from 'next/router'
import {theme, Prompt, Loading, DraftCard} from 'components'
import {ORDERTYPE} from 'config'
import {HOSPITALINFO} from '../config'
import {TopFilterCard, ListTitle} from 'modules/common/components'
import { queryHospitals, showPrompt, selectHospital } from '../../../ducks'
import { connect } from 'react-redux'
import {HospitalListItem, HospitalDetailModal} from '../components'

class HospitalIntroScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
		}
  }

  componentWillMount() {
		this.props.queryHospitals(this.props.client)
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
    return (
      <div>
				<article style={{textAlign: 'right', paddingBottom: theme.lrmargin}}>
					<button style={{width: '1rem'}} className='btnBG btnBGMain btnBGLitt'
						onClick={() => {
							this.props.selectHospital({data: {}});
							Router.push('/hospital/hospital_introduct_detail?type=add')}}>添加医院</button>
				</article>
				<ListTitle data={HOSPITALINFO.hospitalInfo_list_title} />
				{
					hospital && hospital.length > 0 ?
						hospital.map((hospitalItem, iKey) => {
							return <HospitalListItem data={hospitalItem} key={iKey} index={iKey}
							 titleInfo={HOSPITALINFO.hospitalInfo_list_title}
							 page='intro'
							 clickShowModal={(data) => Router.push(`/hospital/hospital_introduct_detail?type=modify&id=${data.id}`)} />
						})
					: 'no data'
				}
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    loading: state.hospital.loading,
		error: state.news.error,
		hospital: state.hospital.data,
  }
}

export default connect(mapStateToProps, { queryHospitals, showPrompt, selectHospital })(HospitalIntroScreen)
