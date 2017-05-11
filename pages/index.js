import { HomeScreen } from '../modules/home'
import { Layout } from '../modules/common'
import withData from '../config/withData'
// import App from '../config/App'

export default withData((props) => {
  return (
    <Layout title='省医通'>
      <HomeScreen />
    </Layout>
  )
})

