import { hospitals, queryHospitals } from './hospitals'
import { departments, queryDepartments, queryDepartmentDetail } from './departments'
import { doctors, queryDoctors, selectDoctor, removeSelectDoctor } from './doctors'
import { user, signup, signin, signout, queryUser, updatePassword, savePhone } from './user'

// key
export {
    hospitals,
    departments,
    doctors,
    user
}

// action
export {
    queryHospitals,
    queryDepartments,
    queryDepartmentDetail,
    queryDoctors,
    selectDoctor,
    removeSelectDoctor,
    signup,
    signin,
    signout,
    queryUser,
    updatePassword,
    savePhone
}

