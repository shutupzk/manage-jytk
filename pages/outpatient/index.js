import { OutpatientScreen } from '../../modules/outpatient'
import withData from '../../config/withData'
// import App from '../../config/App'
import { BlankLayout } from '../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='门诊缴费'>
      <OutpatientScreen {...props} />
    </BlankLayout>
  )
})
