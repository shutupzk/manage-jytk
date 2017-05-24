import { hospitals, queryHospitals } from './hospitals'
import { departments, queryDepartments, queryDepartmentDetail, selectDepartment } from './departments'
import { doctors, queryDoctors, selectDoctor, removeSelectDoctor, queryMyDoctors } from './doctors'
import { user, signup, signin, signout, queryUser, updatePassword, savePhone, currentUser } from './user'
import { patients, queryPatients, addPatient, removePatient, updatePatient, selectPatient, clearPateints, updatePatientDefault } from './patients'
import { appointments, queryAppointments, queryAppointmentDetail, selectAppointment, addAppointment, updateAppointment } from './appointments'
import { schedules, querySchedules, queryScheduleDetail, selectSchedule } from './schedules'
// key
export {
    hospitals,
    departments,
    doctors,
    user,
    patients,
    schedules,
    appointments
}

// action
export {
    queryHospitals,
    queryDepartments,
    selectDepartment,
    queryDepartmentDetail,
    queryDoctors,
    selectDoctor,
    removeSelectDoctor,
    queryMyDoctors,
    signup,
    signin,
    signout,
    queryUser,
    updatePassword,
    savePhone,
    currentUser,
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
    selectSchedule
}
