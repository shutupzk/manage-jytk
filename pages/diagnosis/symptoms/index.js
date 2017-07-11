import { SymptomsScreen } from 'modules/diagnosis'
import withData from 'config/withData'
import { BlankLayout } from 'modules/common'

export default withData((props) => (
  <BlankLayout title='选择症状'>
    <SymptomsScreen {...props} />
  </BlankLayout>
))
