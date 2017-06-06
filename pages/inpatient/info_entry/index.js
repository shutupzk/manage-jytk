import { InfoEntryScreen } from '../../../modules/inpatient'
import withData from '../../../config/withData'
// import App from '../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='入院信息登记'>
      <InfoEntryScreen {...props} />
    </BlankLayout>
  )
})
