import { ExerciseEditScreen } from '../../../modules/exercise'
import { Layout } from '../../../modules/common'
import { withData, HOSPITAL_NAME } from '../../../config'
export default withData(props => {
  return (
    <Layout title={HOSPITAL_NAME} {...props}>
      <ExerciseEditScreen {...props} />
    </Layout>
  )
})
