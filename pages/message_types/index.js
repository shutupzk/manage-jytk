import { MessageTypesScreen } from '../../modules/messages'
import withData from '../../config/withData'
// import App from '../../config/App'
import { BlankLayout } from '../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='消息中心'>
      <MessageTypesScreen {...props} />
    </BlankLayout>
  )
})