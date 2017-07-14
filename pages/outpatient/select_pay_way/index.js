import { SelectPayWayScreen } from 'modules/outpatient'
import withData from 'config/withData'
import { BlankLayout } from 'modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='支付详情'>
      <SelectPayWayScreen {...props} />
    </BlankLayout>
  )
})
