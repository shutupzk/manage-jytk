import { hospitals, queryHospitals } from './hospitals'
import { departments, queryDepartments, queryDepartmentDetail } from './departments'
import { doctors, queryDoctors, selectDoctor, removeSelectDoctor, queryMyDoctors } from './doctors'
import { user, signup, signin, signout, queryUser, updatePassword, savePhone } from './user'
import { patients, queryPatients, addPatient, removePatient, updatePatient, selectPatient, clearPateints, updatePatientDefault } from './patients'

// key
export {
    hospitals,
    departments,
    doctors,
    user,
    patients
}

// action
export {
    queryHospitals,
    queryDepartments,
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
    queryPatients,
    addPatient,
    removePatient,
    updatePatient,
    selectPatient,
    clearPateints,
    updatePatientDefault
}
