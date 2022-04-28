import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { HistoricalChart } from '../config/api';
import { CryptoState } from '../context/CryptoContext';
import { createTheme, ThemeProvider, makeStyles, CircularProgress } from '@material-ui/core';
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { chartDays } from '../config/data';
import SelectButton from './SelectButton';

Chart.register(CategoryScale)

const useStyles = makeStyles((theme) => ({
    container: {
        width: "75%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        padding: 40,
        [theme.breakpoints.down("md")]: {
            width: "100%",
            marginTop: 0,
            padding: 20,
            paddingTop: 0,
        },
    },
    myButton: {
        [theme.breakpoints.down("sm")]: {
            display: "flex",
            alignItems: "center",
            textAlign: "center",
        }
    },
}));

const CoinInfo = ({ coin }) => {

    const classes = useStyles();

    const [historicalData, setHistoricalData] = useState();
    const [days, setDays] = useState(1);
    const [flag, setflag] = useState(false);

    const { currency } = CryptoState();

    const fetchHistoricalData = async () => {
        const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
        setflag(true);
        setHistoricalData(data.prices);
    }

    useEffect(() => {
        fetchHistoricalData();
    }, [currency, days]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff',
            },
            type: "dark",
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <div className={classes.container}>
                {
                    !historicalData | flag === false ? (
                        <CircularProgress
                            style={{ color: 'gold' }}
                            size={250}
                            thickness={1}
                        />
                    ) : (
                        <>
                            <Line
                                data={{
                                    labels: historicalData.map(coin => {
                                        let date = new Date(coin[0]);
                                        let time =
                                            date.getHours() > 12
                                                ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                                                : `${date.getHours()}:${date.getMinutes()} AM`;
                                        return days === 1 ? time : date.toLocaleDateString();
                                    }),

                                    datasets: [
                                        {
                                            data: historicalData.map((coin) => coin[1]),
                                            label: `Price ( Past ${days} Days ) in ${currency}`,
                                            borderColor: "#EEBC1D",
                                        },
                                    ],
                                }}
                                options={{
                                    elements: {
                                        point: {
                                            radius: 1,
                                        },
                                    },
                                }}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    marginTop: 20,
                                    justifyContent: "space-around",
                                    width: "100%",
                                }}

                                className={classes.myButton}
                            >
                                {
                                    chartDays.map((day) => (
                                        <SelectButton
                                            key={day.value}
                                            onClick={() => {
                                                setDays(day.value);
                                                setflag(false);
                                            }}
                                            selected={day.value === days}
                                        >
                                            {day.label}
                                        </SelectButton>
                                    ))
                                }
                            </div>

                        </>
                    )
                }
            </div>
        </ThemeProvider>
    );

}

export default CoinInfo;