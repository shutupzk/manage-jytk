import {BuildingsScreen} from '../../../modules/hospital'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => (
  <BlankLayout title='楼层分布'>
    <BuildingsScreen {...props} />
  </BlankLayout>
))
