import { DiagnosisResultScreen } from 'modules/diagnosis'
import withData from 'config/withData'
import { BlankLayout } from 'modules/common'

export default withData((props) => (
  <BlankLayout title='诊断结果'>
    <DiagnosisResultScreen {...props} />
  </BlankLayout>
))
