import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  auth:false,
  user:null,
  otp:{
    phone:'',
    hash:'',
    expires:''
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      if(action.payload && action.payload.logout){
        state.auth = false
        state.user = null
        state.otp = null
      }
      else {
      const {user} = action.payload
      state.user = user
      state.auth =  true
      state.otp = null}
    },
    
    setOtp: (state, action) => {
      state.otp = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAuth,setOtp,setUser } = authSlice.actions

export default authSlice.reducer