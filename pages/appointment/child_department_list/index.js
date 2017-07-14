import { AppointmentChildDepartmentListScreen } from '../../../modules/appointment'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => (
  <BlankLayout title='科室列表'>
    <AppointmentChildDepartmentListScreen {...props} />
  </BlankLayout>
))
