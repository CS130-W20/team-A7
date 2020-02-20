const initState = {
    authError: null
  }
  
  const authReducer = (state = initState, action) => {
    switch(action.type){
      case 'SIGN_IN_SUCCESS':
        console.log('Sign in success');
        return {
            ...state,
            authError: null
        }
      case 'SIGN_IN_ERROR':
        console.log(action.err.message)
        return {
          ...state,
          authError: 'Login failed'
        }
      case 'SIGN_OUT_SUCCESS':
        console.log('Sign out success');
        return state;
      case 'SIGN_OUT_ERROR':
        console.log(action.err.message)
        return {
          ...state,
          authError: 'Logout failed'
        }
      case 'SIGN_UP_SUCCESS':
        console.log('Sign up success')
        return {
          ...state,
          authError: null
        }
      case 'SIGN_UP_ERROR':
        console.log(action.err.message)
        return {
          ...state,
          authError: action.err.message
        }
      case 'RESET_PASSWORD_SUCCESS':
        console.log('Reset password success')
        return {
          ...state,
          authError: 'success'
        }
      case 'RESET_PASSWORD_ERROR':
        console.log(action.err.message)
        return {
          ...state,
          authError: action.err.message
        }
      case 'CHANGE_PASSWORD_SUCCESS':
        console.log('Change password success')
        return {
          ...state,
          authError: 'success'
        }
      case 'CHANGE_PASSWORD_ERROR':
        console.log(action.err.message)
        return {
          ...state,
          authError: action.err.message
        }
      default:
        return state
    }
  };
  
  export default authReducer;
  
  