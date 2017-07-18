import { QueryInpatientScreen } from '../../../modules/inpatient'
import withData from '../../../config/withData'
// import App from '../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='查询住院记录'>
      <QueryInpatientScreen {...props} />
    </BlankLayout>
  )
})
