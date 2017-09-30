import { UserEditScreen } from '../../../modules/user'
import { Layout } from '../../../modules/common'
import { withData, HOSPITAL_NAME } from '../../../config'
export default withData(props => {
  return (
    <Layout title={HOSPITAL_NAME} {...props}>
      <UserEditScreen {...props} />
    </Layout>
  )
})
