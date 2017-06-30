import { ProfileScreen } from '../../modules/profile'
import withData from '../../config/withData'
// import App from '../../config/App'
import { Layout } from '../../modules/common'

export default withData((props) => {
  return (
    <Layout title='个人中心' url={props.url}>
      <ProfileScreen {...props} />
    </Layout>
  )
})
