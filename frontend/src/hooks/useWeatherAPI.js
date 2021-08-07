import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const fetCurrentWeather = ({ authorizationKey, locationName }) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
            .then(({ data }) => {
                const locationData = data.records.location[0];
                const weatherElements = {};

                locationData.weatherElement.forEach(item => {
                    if (['WDSD', 'TEMP'].includes(item.elementName))
                        weatherElements[item.elementName] = item.elementValue;
                });

                resolve({
                    locationName: locationData.locationName,
                    windSpeed: weatherElements.WDSD,
                    temperature: weatherElements.TEMP,
                    observationTime: locationData.time.obsTime,
                    isLoading: false,
                });
            })
            .catch(err => console.error(err))
    })
}

const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
            .then(({ data }) => {
                const locationData = data.records.location[0];
                const weatherElements = {};

                locationData.weatherElement.forEach(item => {
                    if (['Wx', 'PoP', 'CI'].includes(item.elementName))
                        weatherElements[item.elementName] = item.time[0].parameter;
                });

                resolve({
                    description: weatherElements.Wx.parameterName,
                    weatherCode: weatherElements.Wx.parameterValue,
                    rainPossibility: weatherElements.PoP.parameterName,
                    comfortability: weatherElements.CI.parameterName,
                });
            })
            .catch(err => reject(err))
    })
}

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
    const [weatherElement, setWeatherElement] = useState({
        locationName: "",
        description: "",
        windSpeed: 0,
        temperature: 0,
        rainPossibility: 0,
        observationTime: new Date(),
        comfortability: "",
        weatherCode: 0,
        isLoading: true,
    });

    const fetchData = useCallback(async () => {
        setWeatherElement(prevState => ({
            ...prevState,
            isLoading: true,
        }));

        const [currentWeather, weatherForcast] = await Promise.all([
            fetCurrentWeather({ authorizationKey, locationName }),
            fetchWeatherForecast({ authorizationKey, cityName })
        ]);

        setWeatherElement({
            ...currentWeather,
            ...weatherForcast,
            isLoading: false,
        })
    }, [locationName, cityName, authorizationKey]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return [weatherElement, fetchData];
}

export default useWeatherAPI;