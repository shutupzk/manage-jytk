import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'

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
          <div>loading...</div>
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <div>error...</div>
        </div>
      )
    }
    if (visitNoticeGroup.length > 0) {
      let hospital = this.getHospital(this.props.hospitals)
      return (
        <div>
          <div style={styles.container} >
            {
              hospital.visitNoticeGroup.map((group, i) => (
                <div key={i} style={styles.contentView}>
                  <div style={styles.topView}>
                    <span style={styles.titleText}>{group.name}</span>
                  </div>
                  <div>
                    {
                      group.visitNotices.map((item) => {
                        return (
                          <div style={{backgroundColor: '#ffffff', marginBottom: 1, padding: 10}}
                            key={item.id}
                            onClick={() => {
                              this.props.selectHospitalGuide({noticeGroupId: group.id, noticeId: item.id})
                              this.props.selectHospital({hospitalId: hospital.id})
                              Router.push('/hospital/guide_detail?noticeGroupId=' + group.id + '&noticeId=' + item.id)
                            }}>
                            {item.title}
                            <img src='/static/icons/arrow_right.png' style={{width: 8, height: 10, float: 'right'}} />
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )
    } else {
      return <div>no data</div>
    }
  }
}

const styles = {
  container: {
    flexDirection: 'column'
  },
  contentView: {
    marginBottom: 10
  },
  topView: {
    height: 30,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 1
  },
  titleText: {
    fontSize: 16,
    color: '#3CA0FF',
    padding: 10
  },
  flatlistCW: {
    width: '100%'
  },
  flatlist: {
    backgroundColor: 'white',
    width: '100%'
  },
  itemText: {
    color: '#505050',
    backgroundColor: '#EEEEEE',
    fontSize: 14,
    width: 50
  },
  itemImage: {
    height: 80,
    // width: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    marginVertical: 5
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
