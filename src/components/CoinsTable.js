import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { CoinList } from '../config/api';
import { CryptoState } from '../context/CryptoContext';
import { useEffect } from 'react';
import { Container, createTheme, ThemeProvider, Typography } from '@material-ui/core';

const CoinsTable = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currency } = CryptoState();

    const fetchCoins = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));

        setCoins(data);

        setLoading(false);
    }

    useEffect(() => {
        fetchCoins();
    }, [currency]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff',
            },
            type: 'dark',
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <Container style={{ textAlign: 'center' }}>
                <Typography variant='h4' style={{ margin: 18, fontFamily: 'Montserrat' }} >
                    Cryptocurrency Prices by Market Cap
                </Typography>
            </Container>
        </ThemeProvider>
    )
}

export default CoinsTable;