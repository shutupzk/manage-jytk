import { AppointmentListScreen } from '../../../modules/appointment'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { Layout } from '../../../modules/common'

export default withData((props) => (
  <Layout title='预约列表' url={props.url}>
    <AppointmentListScreen {...props} />
  </Layout>
))
