import { SigninScreen } from '../../modules/profile'
import withData from '../../config/withData'
import { BlankLayout } from '../../modules/common'
import {HOSPITAL_NAME} from 'config'

export default withData((props) => {
  return (
    <BlankLayout title={`${HOSPITAL_NAME}登录`}>
      <SigninScreen {...props} />
    </BlankLayout>
  )
})
