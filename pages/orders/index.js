import { OrderListScreen } from '../../modules/order'
import withData from '../../config/withData'
// import App from '../../config/App'
import { Layout } from '../../modules/common'

export default withData((props) => {
  return (
    <Layout title='挂号订单'>
      <OrderListScreen />
    </Layout>
  )
})