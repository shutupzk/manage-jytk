import { user, signup, signin, signout, queryUser, updatePassword, currentUser, forgotPassword, sendVerifyCode, checkVerifyCode, getUserCookie, getUserCookie2 } from './user'
import { prompt, showPrompt, hidePrompt } from './prompt'
import { order, queryOrderList, queryOrderDetail, updateConsultation } from './order'
import { doctor, queryDoctors, updateDoctor, createDoctor, selectdoctor } from './doctor'
import { department, queryDepartments, updateDepartment, createDepartment, selectdepartment } from './department'
import { hospital, queryHospitals, updateHospital, createHospital, selectHospital, queryHospital } from './hospital'
import { news, queryNews, queryNewGroups, createGroups, updateNewsGroup, removeNewsGroup, createNews, updateNews, removeNews } from './news'
import { buildings, createbuilding, createFloor, createRoom, queryBuildings, queryBuildingDetail, updateBuilding, updateFloor, updateRoom } from './buildings'
import { notices, createVisitNotice, querynotices, queryNoticesGroups, createNoticesGroups, updateNoticesGroups, updateVisitNotice } from './notice'
import { appointments, queryAppointments, cancelAppointment, queryAppointmentDetail } from './appoint'
import { schedule, queryDoctorSchedules, upsertQuickSchedule, selectFastSchedules } from './schedule'
import { article, queryArticles, createArticle, updateArticle, removeArticle, selecteArticle } from './article'
import { qiniu, getQiniuUpToken, selectImgFiles, changeImgBase64 } from './qiniu'

// key
export { user, prompt, order, doctor, department, hospital, news, buildings, notices, appointments, schedule, article, qiniu }

// action
export {
  signup,
  signin,
  signout,
  queryUser,
  updatePassword,
  currentUser,
  forgotPassword,
  sendVerifyCode,
  checkVerifyCode,
  getUserCookie,
  getUserCookie2,
  showPrompt,
  hidePrompt,
  queryOrderList,
  queryOrderDetail,
  updateConsultation,
  queryDoctors,
  updateDoctor,
  createDoctor,
  selectdoctor,
  queryDepartments,
  updateDepartment,
  createDepartment,
  selectdepartment,
  queryHospitals,
  updateHospital,
  createHospital,
  selectHospital,
  queryHospital,
  queryNews,
  queryNewGroups,
  createGroups,
  updateNewsGroup,
  removeNewsGroup,
  createNews,
  updateNews,
  removeNews,
  createbuilding,
  createFloor,
  createRoom,
  queryBuildings,
  queryBuildingDetail,
  updateBuilding,
  updateFloor,
  updateRoom,
  createVisitNotice,
  querynotices,
  queryNoticesGroups,
  createNoticesGroups,
  updateNoticesGroups,
  updateVisitNotice,
  queryAppointments,
  cancelAppointment,
  queryAppointmentDetail,
  queryDoctorSchedules,
  upsertQuickSchedule,
  selectFastSchedules,
  queryArticles,
  createArticle,
  updateArticle,
  removeArticle,
  selecteArticle,
  getQiniuUpToken,
  selectImgFiles,
  changeImgBase64
}
