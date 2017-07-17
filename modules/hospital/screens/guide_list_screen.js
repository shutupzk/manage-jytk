import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import {ErrCard, Loading, theme, NoDataCard} from 'components'

import {
  queryHospitalGuides,
  queryHospitals,
  selectHospitalGuide,
  selectHospital
} from '../../../ducks'
import { isEmptyObject } from '../../../utils'

class GuideListScreen extends Component {
  componentWillMount () {
    const hospitals = this.props.hospitals
    if (isEmptyObject(this.props.hospitals)) {
      this.hetHospitalWithGuides()
    } else if (!this.getHospital(hospitals).visitNoticeGroup) {
      this.getGuides(this.getHospital(hospitals).id)
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
  getGuides (hospitalId) {
    this.props.queryHospitalGuides(this.props.client, {hospitalId})
  }
  render () {
    let hospital = this.getHospital(this.props.hospitals)
    let visitNoticeGroup = hospital.visitNoticeGroup || []
    if (this.props.loading) {
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
    if (visitNoticeGroup.length > 0) {
      let hospital = this.getHospital(this.props.hospitals)
      return (
        <div>
          <div>
            {
              hospital.visitNoticeGroup.map((group, i) => (
                <div key={i} className={'contentView'}>
                  <div className={'topView'}>
                    <span className={'titleText'}>{group.name}</span>
                  </div>
                  <div>
                    {
                      group.visitNotices.map((item) => {
                        return (
                          <div
                            className='flex tb-flex'
                            style={{borderBottom: '1px solid #fff', borderColor: theme.bordercolor, padding: '10px 15px', justifyContent: 'space-between'}}
                            key={item.id}
                            onClick={() => {
                              this.props.selectHospitalGuide({noticeGroupId: group.id, noticeId: item.id})
                              this.props.selectHospital({hospitalId: hospital.id})
                              Router.push('/hospital/guide_detail?noticeGroupId=' + group.id + '&noticeId=' + item.id)
                            }}>
                            {item.title}
                            <p className='back-left' style={{transform: 'rotate(135deg)'}}></p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              ))
            }
          </div>
          <style jsx>{`
            .contentView {
              margin-bottom: 10px;
              background: #fff
            }
            .topView {
              line-height: 40px;
              background-color: #FFF;
              align-items: center;
              border-bottom: 1px solid ${theme.bordercolor};
            }
            .titleText {
              font-size: 16px;
              color: ${theme.maincolor};
              padding: 10px;
            },
          `}</style>
        </div>
      )
    } else {
      return <NoDataCard tip='暂无数据' />
    }
  }
}

function mapStateToProps (state) {
  return {
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
})(GuideListScreen)
