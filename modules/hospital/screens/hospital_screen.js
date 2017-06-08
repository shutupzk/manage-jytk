import React from 'react'
import { connect } from 'react-redux'
import { HospitalFunctionList } from '../components'
import { HOSPITAL_FUNCTION_LIST } from '../../../config'
import { List } from '../../../components'
import { queryHospitals } from '../../../ducks'
import { isEmptyObject } from '../../../utils'

class HospitalScreen extends React.Component {
  compomentWillMount () {
    if (isEmptyObject(this.props.hospitals)) {
      this.props.queryHospitals(this.props.client)
    }
  }

  render () {
    return (
      <div>
        <div>
          <img className='bgImage' src='/static/icons/hospital_bg_image.png' />
        </div>
        <div>
          <List component={HospitalFunctionList} items={HOSPITAL_FUNCTION_LIST} />
        </div>
        <style jsx>{`
          .ScrollDiv {
            overflow-y:auto;
          }
          .bgImage {
            height: 180px;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    hospitals: state.hospitals.data,
    loading: state.hospitals.loading,
    error: state.hospitals.error
  }
}

export default connect(mapStateToProps, {queryHospitals})(HospitalScreen)
