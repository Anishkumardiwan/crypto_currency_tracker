import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';

const Crypto = createContext();

const CryptoContext = ({ children }) => {

    const [currency, setCurrency] = useState('INR');
    const [symbol, setSymbol] = useState('₹');

    useEffect(() => {
        if (currency === "INR") setSymbol('₹');
        else if (currency === "USD") setSymbol('$');
    }, [currency]);

    return (
        <Crypto.Provider value={{
            currency,
            setCurrency,
            symbol,
            setSymbol
        }}>
            {children}
        </Crypto.Provider>
    )
}

export const CryptoState = () => {
    return useContext(Crypto);
}

export default CryptoContext;
