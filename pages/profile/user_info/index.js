import { UserInfoScreen } from '../../../modules/profile'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='登录'>
      <UserInfoScreen {...props} />
    </BlankLayout>
  )
})
