import {FloorsScreen} from '../../../modules/hospital'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => (
  <BlankLayout title='楼层分布'>
    <FloorsScreen {...props} />
  </BlankLayout>
))
