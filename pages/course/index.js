import { CourseVedioListScreen } from '../../modules/course'
import { Layout } from '../../modules/common'
import { withData, HOSPITAL_NAME } from '../../config'
export default withData(props => {
  return (
    <Layout title={HOSPITAL_NAME} {...props}>
      <CourseVedioListScreen {...props} />
    </Layout>
  )
})
