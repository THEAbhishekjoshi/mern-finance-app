import { createSlice } from '@reduxjs/toolkit';
import i18n from '../../i18n/i18n.js';
const languageState={
    lang: 'en'
}

const languageSlice= createSlice({
    name:'i18n',
    initialState:languageState,
    reducers:{
        setLanguage:(state,action)=>{
            state.lang= action.payload,
            i18n.changeLanguage(action.payload)
        },
        resetLanguage: ()=>initialState, 
    }
});

export const {setLanguage} = languageSlice.actions;
export default languageSlice.reducer


//
//dispatch(setLanguage("hi"))
//lang: "en"


// this is action
//{
// type: setLanguage,
// payload: "hi"
//}