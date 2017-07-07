import { MessagesScreen } from '../../../modules/messages'
import withData from '../../../config/withData'
// import App from '../../config/App'
// import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <MessagesScreen {...props} />
  )
})