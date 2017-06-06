import { AppointmentSuccessScreen } from '../../../modules/appointment'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => (
  <BlankLayout title='预约列表'>
    <AppointmentSuccessScreen {...props} />
  </BlankLayout>
))