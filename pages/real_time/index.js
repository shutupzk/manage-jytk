import withData from '../../config/withData'
import { BlankLayout } from '../../modules/common'
import { RealTimeScreen } from '../../modules/realtime'

export default withData((props) => {
  return (
    <BlankLayout title='候诊提醒'>
			<RealTimeScreen {...props} />
    </BlankLayout>
  )
})
