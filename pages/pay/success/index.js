import { PaySuccessScreen } from 'modules/pay'
import withData from 'config/withData'
// import App from '../../../config/App'
import { BlankLayout } from 'modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='支付成功'>
      <PaySuccessScreen {...props} />
    </BlankLayout>
  )
})
