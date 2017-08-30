import { SigninScreen } from '../../modules/profile'
import withData from '../../config/withData'
// import App from '../../config/App'
import { BlankLayout } from '../../modules/common'
import {HOSPITAL_NAME} from 'config'
console.log('HOSPITAL_NAME ==== ', HOSPITAL_NAME)

export default withData((props) => {
  return (
    <BlankLayout title={`${HOSPITAL_NAME}登录`}>
      <SigninScreen {...props} />
    </BlankLayout>
  )
})
