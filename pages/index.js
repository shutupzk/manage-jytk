import { HomeScreen } from '../modules/home'
import { Layout } from '../modules/common'
import withData from '../config/withData'
import { HOSPITAL_NAME } from '../config'
export default withData(props => {
  return (
    <Layout title={HOSPITAL_NAME} {...props}>
      <HomeScreen {...props} />
    </Layout>
  )
})
