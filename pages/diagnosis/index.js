import { DiagnosisScreen } from 'modules/diagnosis'
import withData from '../../config/withData'
// import App from '../../config/App'
import { BlankLayout } from '../../modules/common'

export default withData((props) => (
  <BlankLayout title='疾病自查'>
    <DiagnosisScreen {...props} />
  </BlankLayout>
))
