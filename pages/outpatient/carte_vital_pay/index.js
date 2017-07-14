import { CarteVitalPayScreen, BindCarteVitalScreen, CheckCarteVitalScreen } from 'modules/outpatient'
import withData from 'config/withData'
import { BlankLayout } from 'modules/common'

export default withData((props) => {
  return (
    <BlankLayout title='确认信息'>
      <CheckCarteVitalScreen {...props} />
    </BlankLayout>
  )
})
