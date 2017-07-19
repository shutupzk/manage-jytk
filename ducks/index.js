import { user, signup, signin, signout, queryUser, updatePassword, savePhone, currentUser, forgotPassword, sendVerifyCode, checkVerifyCode, getUserCookie, getUserCookie2 } from './user'
import {prompt, showPrompt, hidePrompt} from './prompt'
import {order, queryOrderList, queryOrderDetail} from './order'

// key
export {
    user,
    prompt,
    order
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
    queryOrderDetail
}
