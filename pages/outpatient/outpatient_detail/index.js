import { OutpatientDetailScreen } from 'modules/outpatient'
import withData from 'config/withData'
import { BlankLayout } from 'modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='费用详情'>
      <OutpatientDetailScreen {...props} />
    </BlankLayout>
  )
})
