import { hospitals, queryHospitals, queryHospitalBuildings, selectHospital, selectHospitalBuildings, queryHospitalGuides, selectHospitalGuide } from './hospitals'
import { departments, queryDepartments, queryDepartmentDetail, selectDepartment, searchDepartments, removeSearchDepIds, addDepartmentEvaluate, queryChildDepartments, selectParentDepartment } from './departments'
import { doctors, queryDoctors, queryDoctorDetail, selectDoctor, removeSelectDoctor, queryMyDoctors, createUserHasDoctor, removeUserHasDoctor, searchDoctors, removeSearchDocIds, setQueryFlag } from './doctors'
import { doctorEvaluates, addDoctorEvaluate } from './doctor_evaluate'
import { user, signup, signin, signout, queryUser, updatePassword, savePhone, currentUser, forgotPassword, sendVerifyCode, checkVerifyCode } from './user'
import { patients, queryPatients, addPatient, removePatient, updatePatient, selectPatient, clearPateints, updatePatientDefault } from './patients'
import { appointments, queryAppointments, queryAppointmentDetail, selectAppointment, addAppointment, updateAppointment } from './appointments'
import { schedules, querySchedules, queryScheduleDetail, selectSchedule } from './schedules'
import { clinicStops, queryClinicStops } from './clinic_stops'
import { news, queryNewsGroups, queryNews, selectNews, queryNewsDetail } from './news'
import { examinations, queryExaminations, selectExamination } from './examinations'
import { laboratories, queryLaboratories, selectLaboratory, queryLaboratoryItems } from './laboratories'
import { outpatient, queryOutpatient, queryOutpatientDetail, selectOutpatient } from './outpatient'
import { inpatient, queryInpatient, selectInpatient, updateInpatientRecord } from './inpatient'
import { billitem, queryBillitems, selectBillitem } from './billitem'
import { dailyfee, queryDailyfee, selectInpatientRecord } from './dailyfee'
import { questions, queryQuestions } from './questions'
import { deposit, queryDeposits, selectDeposit } from './deposit'
import { addHospitalEvaluate } from './hospital_evaluate'
import { patientTypes, queryPatientTypes, selectPatientType } from './patient_types'
import { messages, lastMessages, queryMessageTypes, queryMessages, selectMessageType, readMessage, queryLastMessage } from './messages'
import { payments, queryPayments, selectPayment } from './payments'

// key
export {
    hospitals,
    departments,
    doctors,
    doctorEvaluates,
    user,
    patients,
    schedules,
    appointments,
    clinicStops,
    news,
    examinations,
    laboratories,
    outpatient,
    inpatient,
    billitem,
    dailyfee,
    questions,
    deposit,
    patientTypes,
    messages,
    lastMessages,
    payments
}

// action
export {
    queryHospitals,
    queryDepartments,
    selectDepartment,
    queryDepartmentDetail,
    searchDepartments,
    removeSearchDepIds,
    queryChildDepartments,
    selectParentDepartment,
    addDepartmentEvaluate,
    queryDoctors,
    queryDoctorDetail,
    selectDoctor,
    removeSelectDoctor,
    queryMyDoctors,
    createUserHasDoctor,
    removeUserHasDoctor,
    searchDoctors,
    removeSearchDocIds,
    setQueryFlag,
    addDoctorEvaluate,
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
    queryPatients,
    addPatient,
    removePatient,
    updatePatient,
    selectPatient,
    clearPateints,
    updatePatientDefault,
    queryAppointments,
    queryAppointmentDetail,
    selectAppointment,
    addAppointment,
    updateAppointment,
    querySchedules,
    queryScheduleDetail,
    selectSchedule,
    queryClinicStops,
    queryNewsGroups,
    queryNews,
    selectNews,
    queryNewsDetail,
    queryExaminations,
    selectExamination,
    queryLaboratories,
    selectLaboratory,
    queryLaboratoryItems,
    queryHospitalBuildings,
    selectHospital,
    selectHospitalBuildings,
    queryHospitalGuides,
    selectHospitalGuide,
    queryOutpatient,
    queryOutpatientDetail,
    selectOutpatient,
    queryInpatient,
    selectInpatient,
    updateInpatientRecord,
    queryBillitems,
    selectBillitem,
    queryDailyfee,
    selectInpatientRecord,
    queryQuestions,
    queryDeposits,
    selectDeposit,
    addHospitalEvaluate,
    queryPatientTypes,
    selectPatientType,
    queryMessageTypes,
    queryMessages,
    selectMessageType,
    readMessage,
    queryLastMessage,
    queryPayments,
    selectPayment
}
