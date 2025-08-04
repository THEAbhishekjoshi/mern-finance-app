import { createSlice } from '@reduxjs/toolkit';

// Account slice initial state
const accountState = {
  accounts: [],
  transaction:[],
};

const plaidAccountSlice = createSlice({
  name: 'plaidAccountInfo',
  initialState: accountState,
  reducers: {
    setPlaidAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    addPlaidAccount: (state, action) => {
      state.accounts.push(action.payload);
    },
    addTransactionInfo:(state,action)=>{
      state.transaction.push(action.payload);
    },
    setTransactionInfo:(state,action)=>{
      state.transaction=action.payload;
    },
    
    resetPlaidAccounts: () => ({                    // resetPlaidAccounts: () => accountState
      accounts: [],
      transaction:[]
    }),
  },
});
export const {
  setPlaidAccounts,
  addPlaidAccount,
  addTransactionInfo,
  setTransactionInfo,
  resetPlaidAccounts,
} = plaidAccountSlice.actions;
export default plaidAccountSlice.reducer;