import {NewsDetailScreen} from '../../../modules/hospital'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => (
  <BlankLayout title='健康资讯'>
    <NewsDetailScreen {...props} />
  </BlankLayout>
))
