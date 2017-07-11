import React, { Component } from 'react'
import { connect } from 'react-redux'
import {ErrCard, Loading, theme} from 'components'

import {
  queryHospitalGuides,
  queryHospitals,
  selectHospitalGuide,
  selectHospital
} from '../../../ducks'
import { isEmptyObject } from '../../../utils'

const filterGuides = (guides, selectGuideIds) => {
  let guide = guides.filter((guide) => {
    if (selectGuideIds.noticeGroupId === guide.id) {
      return true
    }
    return false
  })
  return filterNotices(guide[0].visitNotices, selectGuideIds.noticeId)
}
const filterNotices = (notices, noticeId) => {
  let notice = notices.filter((notice) => {
    if (noticeId === notice.id) {
      return true
    }
    return false
  })
  return notice[0]
}
class GuideDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {isInit: false}
  }
  componentWillMount () {
    const hospitals = this.props.hospitals
    if (isEmptyObject(this.props.hospitals)) {
      this.setState({isInit: true})
      this.hetHospitalWithGuides()
    } else if (!this.getHospital(hospitals).visitNoticeGroup) {
      this.setState({isInit: true})
      this.getGuides(this.getHospital(hospitals).id)
    } else {
      if (!this.props.selectGuideIds) {
        let noticeGroupId = this.props.url.query.noticeGroupId
        let noticeId = this.props.url.query.noticeId
        this.props.selectHospitalGuide({noticeGroupId, noticeId})
      }
    }
  }

  getHospital (hospitals) {
    let hosiptal = {}
    for (let item in hospitals) {
      hosiptal = hospitals[item]
      break
    }
    return hosiptal
  }
  async hetHospitalWithGuides () {
    await this.props.queryHospitals(this.props.client)
    const hospitals = this.props.hospitals
    this.getGuides(this.getHospital(hospitals).id)
  }
  async getGuides (hospitalId) {
    await this.props.queryHospitalGuides(this.props.client, {hospitalId})
    await this.props.selectHospital({hospitalId})
    let noticeGroupId = this.props.url.query.noticeGroupId
    let noticeId = this.props.url.query.noticeId
    await this.props.selectHospitalGuide({noticeGroupId, noticeId})
    this.setState({isInit: false})
  }

  render () {
    if (this.props.loading || this.state.isInit) {
      return (
        <div>
          <div><Loading showLoading={true} /></div>
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <div><ErrCard /></div>
        </div>
      )
    }
    let {hospitals, selectId, selectGuideIds} = this.props
    let hosiptal = hospitals[selectId]
    let guides = hosiptal.visitNoticeGroup || []
    let guide = filterGuides(guides, selectGuideIds)
    return (
      <div>
        <div style={{color: '#505050', fontSize: 15, padding: 15, backgroundColor: 'white', lineHeight: '28px', textIndent: '2em'}}>
          {guide.content}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    selectGuideIds: state.hospitals.selectGuideIds,
    selectId: state.hospitals.selectId,
    hospitals: state.hospitals.data,
    loading: state.hospitals.loading,
    error: state.hospitals.error
  }
}

export default connect(mapStateToProps, {
  queryHospitalGuides,
  queryHospitals,
  selectHospitalGuide,
  selectHospital
})(GuideDetailScreen)
