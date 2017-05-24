import { ScheduleDetailScreen } from '../../../modules/appointment'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => (
  <BlankLayout title='挂号列表'>
    <ScheduleDetailScreen {...props} />
  </BlankLayout>
))
