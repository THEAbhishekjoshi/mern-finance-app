import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    register:{
        fullname:'',
        email:'',
    },
    accountType: '',
    country: '',
    MobileNumber: '',
}
const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        setAccountType: (state, action) => {
            state.accountType = action.payload;
        },
        setCountry: (state, action) => {
            state.country = action.payload;
        },
        setMobileNumber: (state, action) => {
            state.MobileNumber = action.payload;
        },
        setRegister: (state,action)=>{
            state.register = action.payload
        },
        resetRegistration: ()=>initialState,
    },
})

export const {
  setAccountType,
  setCountry,
  setMobileNumber,
  setEmail,
  setRegister,
  resetRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;