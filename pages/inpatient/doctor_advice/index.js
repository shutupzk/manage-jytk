import { DoctorAdviceScreen } from '../../../modules/inpatient'
import withData from '../../../config/withData'
// import App from '../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='出院医嘱'>
      <DoctorAdviceScreen {...props} />
    </BlankLayout>
  )
})
