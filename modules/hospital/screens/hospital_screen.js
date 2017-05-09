import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { HospitalFunctionList } from '../components'
import { HOSPITAL_FUNCTION_LIST } from '../../../config'
import { List, ListItem} from '../../../components'
import * as actions from '../../../ducks'


function  HospitalScreen (props) {
  console.log(props)
  return (
  <div style={styles.container}>
        <div style={styles.containerStyle}>
          <img style={styles.bgImage} src="../../../static/icons/hospital_bg_image.png"/>
        </div>
        <div style={styles.scrollContainer}>
          <List component={HospitalFunctionList} items={HOSPITAL_FUNCTION_LIST} />
        </div>
        <style jsx>{`
            .ScrollDiv {
              height:'';
              overflow-y:auto;
            }
        `}</style>
      </div>
)
}


const styles = {
  container: {
    flex: 1
  },
  containerStyle: {
    flexDirection: 'column'
  },
  scrollContainer:{
    display: 'flex',
    flexDirection: 'column'
  },
  bgImage: {
    height: 180,
    width: '100%',
    resizeMode: 'stretch'
  }
}
function mapStateToProps (state) {
  return {
    hospital: state.hospitals
  }
}
export default connect(
  mapStateToProps,actions
)(HospitalScreen)