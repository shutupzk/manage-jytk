import { DepartmentScreen } from '../../../modules/hospital'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => (
  <BlankLayout title='科室列表'>
    <DepartmentScreen />
  </BlankLayout>
))