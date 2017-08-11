import { HospitalIntroDetailScreen } from 'modules/hospital'
import { Layout } from 'modules/common'
import {withData, HOSPITAL_NAME} from 'config'
// import React, { Component } from 'react'
// import App from '../config/App'

export default withData((props) => {
  return (
    <Layout title={HOSPITAL_NAME} {...props}>
      <HospitalIntroDetailScreen {...props} />
    </Layout>
  )
})