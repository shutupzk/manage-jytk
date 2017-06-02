import { LaboratoryDetailScreen } from '../../../modules/report'
import withData from '../../../config/withData'
// import App from '../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='报告详情'>
      <LaboratoryDetailScreen {...props} />
    </BlankLayout>
  )
})
