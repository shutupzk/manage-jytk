import React from 'react'
import { HospitalFunctionList } from '../components'
import { HOSPITAL_FUNCTION_LIST } from '../../../config'
import { List } from '../../../components'

function HospitalScreen (props) {
  return (
    <div style={styles.container}>
      <div style={styles.containerStyle}>
        <img style={styles.bgImage} src='../../../static/icons/hospital_bg_image.png' />
      </div>
      <div style={styles.scrollContainer}>
        <List component={HospitalFunctionList} items={HOSPITAL_FUNCTION_LIST} />
      </div>
      <style jsx>{`
        .ScrollDiv {
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
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  bgImage: {
    height: 180,
    width: '100%',
    resizeMode: 'stretch'
  }
}

export default HospitalScreen
