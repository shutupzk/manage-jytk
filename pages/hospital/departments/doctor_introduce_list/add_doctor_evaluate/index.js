import { AddDoctorEvaluateScreen } from '../../../../../modules/hospital'
import withData from '../../../../../config/withData'
import { BlankLayout } from '../../../../../modules/common'

export default withData((props) => (
  <BlankLayout title='医生列表'>
    <AddDoctorEvaluateScreen {...props} />
  </BlankLayout>
))
