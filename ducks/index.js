import { user, signup, signin, signout, queryUser, updatePassword, savePhone, currentUser, forgotPassword, sendVerifyCode, checkVerifyCode, getUserCookie, getUserCookie2 } from './user'
import {prompt, showPrompt, hidePrompt} from './prompt'
import {order, queryOrderList, queryOrderDetail} from './order'
import {doctor, queryDoctors, queryDoctorDetail, updateDoctor, createDoctor} from './doctor'
import {department, queryDepartments, updateDepartment, createDepartment} from './department'
import {hospital, queryHospitals, updateHospital, createHospital} from './hospital'
import {news, queryNews, queryNewGroups, createNews, updateNews} from './news'
import {buildings, createbuilding, createFloor, createRoom, queryBuildings, queryBuildingDetail, updateBuilding, updateFloor, updateRoom} from './buildings'
import {notices, createVisitNotice, querynotices, queryNoticesGroups, updateVisitNotice} from './notice'

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
    notices
}

// action
export {
    signup,
    signin,
    signout,
    queryUser,
    updatePassword,
    savePhone,
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
    queryDoctorDetail,
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
    createNews,
    updateNews,
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
    updateVisitNotice
}
