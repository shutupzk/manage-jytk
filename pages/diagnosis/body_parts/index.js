import { BodyPartsScreen } from 'modules/diagnosis'
import withData from 'config/withData'
import { BlankLayout } from 'modules/common'

export default withData((props) => (
  <BlankLayout title='选择部位'>
    <BodyPartsScreen {...props} />
  </BlankLayout>
))
