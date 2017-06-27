import { SelectPayWayScreen } from '../../../modules/appointment'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => (
  <BlankLayout title='支付详情'>
    <SelectPayWayScreen {...props} />
  </BlankLayout>
))
