import { AppointmentDoctorListScreen } from '../../../modules/appointment'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => (
  <BlankLayout title='医生列表'>
    <AppointmentDoctorListScreen {...props} />
  </BlankLayout>
))
