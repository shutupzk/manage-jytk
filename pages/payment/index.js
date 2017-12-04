import { PaymentListScreen } from '../../modules/payment'
import { Layout } from '../../modules/common'
import { withData, HOSPITAL_NAME } from '../../config'
export default withData(props => {
  return (
    <Layout title={HOSPITAL_NAME} {...props}>
      <PaymentListScreen {...props} />
    </Layout>
  )
})
