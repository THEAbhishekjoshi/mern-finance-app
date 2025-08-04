import axios from 'axios';
import React, { useEffect, useState } from 'react'

const useMobileNumber = () => {
    const [MobileNumber, setMobileNumber] = useState([]);
    useEffect(() => {
        const run = async () => {
            const res = await axios.get("https://restcountries.com/v3.1/all?fields=name,idd");
            setMobileNumber(res.data)
        }
        run()
    }, [])
    return MobileNumber

}

export default useMobileNumber