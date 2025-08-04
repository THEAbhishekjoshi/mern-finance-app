import {configureStore,combineReducers} from '@reduxjs/toolkit';
import languageReducer from '../features/languageSelector/languageSlice.js'
import registartionReducer from '../features/onboarding/registrationSlice.js'
import plaidAccountReducer from '../features/plaidAccount/plaidAccountInfoSlice.js'
import storage from 'redux-persist/lib/storage';  //by default is localStorage
import { persistStore, persistReducer } from 'redux-persist';


                    /// BASIC STORE
// export const store =  configureStore({
//     reducer:{
//         registration: registartionReducer,
//     },
// })

const userId = localStorage.getItem('userId') || 'guest';
//combine reducers
const rootReducer = combineReducers({
    registration: registartionReducer,
    plaidAccountInfo: plaidAccountReducer,
    i18n:languageReducer
});

//config for redux-persist
const persistConfig = {
    key: root,
    storage,
    whitelist: [ 'registration','plaidAccountInfo','i18n'] //or if you wanted all , you can just remove whitelist
} 

//created a persisted reducer
const persistedReducer = persistReducer(persistConfig,rootReducer);

//create the store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false 
        })
})

//create the persistor 
export const persistor = persistStore(store);