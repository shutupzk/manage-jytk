import { PaymentScreen } from '../../../modules/inpatient'
import withData from '../../../config/withData'
// import App from '../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='预缴金充值'>
      <PaymentScreen {...props} />
    </BlankLayout>
  )
})
