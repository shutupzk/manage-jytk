import { user, signup, signin, signout, queryUser, updatePassword, currentUser, forgotPassword, sendVerifyCode, checkVerifyCode, getUserCookie, getUserCookie2 } from './user'
import {prompt, showPrompt, hidePrompt} from './prompt'
import {order, queryOrderList, queryOrderDetail} from './order'
import {doctor, queryDoctors, updateDoctor, createDoctor} from './doctor'
import {department, queryDepartments, updateDepartment, createDepartment} from './department'
import {hospital, queryHospitals, updateHospital, createHospital} from './hospital'
import {news, queryNews, queryNewGroups, createGroups, updateNewsGroup, removeNewsGroup, createNews, updateNews, removeNews} from './news'
import {buildings, createbuilding, createFloor, createRoom, queryBuildings, queryBuildingDetail, updateBuilding, updateFloor, updateRoom} from './buildings'
import {notices, createVisitNotice, querynotices, queryNoticesGroups, createNoticesGroups, updateNoticesGroups, updateVisitNotice} from './notice'
import {appointments, queryAppointments, cancelAppointment, queryAppointmentDetail} from './appoint'
import {schedule, querySchedules} from './schedule'

// key
export {
    user,
    prompt,
    order,
    doctor,
    department,
    hospital,
    news,
    buildings,
    notices,
    appointments,
    schedule
}

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
    queryDoctors,
    updateDoctor,
    createDoctor,
    queryDepartments,
    updateDepartment,
    createDepartment,
    queryHospitals,
    updateHospital,
    createHospital,
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
    querySchedules
}
