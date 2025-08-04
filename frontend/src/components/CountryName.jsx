import axios from 'axios';
import React, { useEffect, useState } from 'react'

const CountryName = () => {
    const [countries,setCountries] = useState([])

    useEffect(()=>{
        const run = async()=>{
            const res = await axios.get("https://restcountries.com/v3.1/all?fields=name");
            
            setCountries(res.data);
        }
        run()
    },[])
    return countries;

}

export default CountryName;