import { ReportScreen } from '../../modules/report'
import withData from '../../config/withData'
import { BlankLayout } from '../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='报告查询'>
      <ReportScreen {...props} />
    </BlankLayout>
  )
})
