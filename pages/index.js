import { HomeScreen } from '../modules/home'
import { Layout } from '../modules/common'
import withData from '../config/withData'
// import React, { Component } from 'react'
// import App from '../config/App'

export default withData((props) => {
  return (
    <Layout title='省医通' {...props}>
      <HomeScreen {...props} />
    </Layout>
  )
})
// export default withData((props) => {
//   return (
//     <MyHome {...props} />
//   )
// })
// const MyHome = (props) => {
//   console.log(props)
//   return (<h2>my Home</h2>)
// }
// MyHome.getInitialProps = async function (context) {
//   const query = context.query
//   console.log(query)
//   console.log('query')
//   return { user: 'baek' }
// }
