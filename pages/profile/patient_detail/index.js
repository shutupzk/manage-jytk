import { PatientDetailScreen } from '../../../modules/profile'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='就诊人信息'>
      <PatientDetailScreen {...props} />
    </BlankLayout>
  )
})
