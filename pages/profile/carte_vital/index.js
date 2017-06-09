import { CarteVitalScreen } from '../../../modules/profile'
import withData from '../../../config/withData'
// import App from '../../../config/App'
import { BlankLayout } from '../../../modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='医保卡信息'>
      <CarteVitalScreen {...props} />
    </BlankLayout>
  )
})
