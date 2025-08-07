import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addPlaidAccount, addTransactionInfo } from '../features/plaidAccount/plaidAccountInfoSlice';

const B1 = () => {
    const [linkToken, setLinkToken] = useState(null);
    // const [accessToken, setAccessToken] = useState(null);
    const [accountInfo, setAccountInfo] = useState(null);
    const dispatch = useDispatch();
    const store = useSelector((state) => state.plaidAccountInfo.accounts);

    // Step 1: Create link_token on load
    useEffect(() => {
        const createLinkToken = async () => {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/create_link_token`);
            setLinkToken(response.data.link_token);
        };
        createLinkToken();
    }, []);

    const onSuccess = async (public_token, metadata) => {
        try {
            // Exchange token
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/exchange_public_token`, {
                public_token,
            });
            const access_Token = response.data.accessToken;
            console.log('Access Token:', access_Token);


            // Fetch account details
            const accountResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/accounts`, {
                accessToken: access_Token,
            });
            console.log('Account Response:', accountResponse);
            const info = accountResponse.data;
            setAccountInfo(info);
            // DISPATCH TO REDUX IMMEDIATELY
            const institutionId = info?.item?.institution_id;
            const exists = store.some(item => item.institutionId === institutionId);
            const institution_name = info?.item?.institution_name || 'Unknown Bank';
            if (!exists && institutionId) {
                dispatch(addPlaidAccount({
                    accountList: info.accounts,
                    institutionId,
                    institution_name,
                    accessTokens:access_Token
                }))
                toast.success("Account Information Fetched!")
            }
            else{
                toast.error("Already added!!")
            }
            console.log("Account Details:", info);
        } catch (err) {
            console.error('Error in linking or fetching accounts:', err);
            alert('Something went wrong.');
        }
    };

    const config = {
        token: linkToken,
        onSuccess,  //access token
    };

    const { open, ready } = usePlaidLink(config);

    useEffect(() => {
        const call = async () => {
            if (ready && linkToken) {
                open()
            }
        }
        call();
    }, [ready, linkToken, open])

}
export default B1;
