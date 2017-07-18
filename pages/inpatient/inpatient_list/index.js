import { InpatientListScreen } from '../../../modules/inpatient'
import withData from '../../../config/withData'
// import App from '../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='住院记录'>
      <InpatientListScreen {...props} />
    </BlankLayout>
  )
})
