import { OrderTypeScreen } from '../../../modules/outpatient'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='缴费类型'>
      <OrderTypeScreen {...props} />
    </BlankLayout>
  )
})
