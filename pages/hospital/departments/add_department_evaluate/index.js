import { AddDepartmentEvaluateScreen } from '../../../../modules/hospital'
import withData from '../../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../../modules/common'

export default withData((props) => (
  <BlankLayout title='科室评价'>
    <AddDepartmentEvaluateScreen {...props} />
  </BlankLayout>
))