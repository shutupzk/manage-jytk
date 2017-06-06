import { DepositDetailScreen } from '../../../modules/profile'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='交易详情'>
      <DepositDetailScreen {...props} />
    </BlankLayout>
  )
})
