import {NavigationMapsScreen} from '../../../../modules/hospital'
import withData from '../../../../config/withData'
import { BlankLayout } from '../../../../modules/common'

export default withData((props) => (
  <BlankLayout title='地图导航'>
    <NavigationMapsScreen {...props} />
  </BlankLayout>
))
