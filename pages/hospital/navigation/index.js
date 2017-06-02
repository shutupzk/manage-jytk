import {NavigationScreen} from '../../../modules/hospital'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => (
  <BlankLayout title='来院导航'>
    <NavigationScreen {...props} />
  </BlankLayout>
))
