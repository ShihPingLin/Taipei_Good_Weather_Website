import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

import WeatherCard from './views/WeatherCard';
import { getDayOrNight, findLocation } from './utils/helpers';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './views/WeatherSetting';

const AUTHORIZATION_KEY = 'CWB-6862A940-EF1C-4C87-A1CC-1C07E3DF6D85';

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    terperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow: "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    terperatureColor: "#dddddd",
    textColor: "#cccccc",
  }
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  const [currTheme, setCurrTheme] = useState("light");
  const [currPage, setCurrPage] = useState('WeatherCard');
  const storageCity = localStorage.getItem('cityName') || '臺北市';
  const [currCity, setCurrCity] = useState(storageCity);
  const currLocation = useMemo(() => findLocation(currCity), [currCity]);
  const { cityName, locationName, sunriseCityName } = currLocation;
  const dayOrNight = useMemo(() => getDayOrNight(sunriseCityName), [sunriseCityName]);
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  })
  useEffect(() => {
    setCurrTheme(dayOrNight === 'day' ? 'light' : 'dark');
  }, [dayOrNight]);
  const handleCurrPageChange = (currPage) => {
    setCurrPage(currPage);
  };
  const handleCurrCityChange = (currCity) => {
    setCurrCity(currCity);
  };

  return (
    <ThemeProvider theme={theme[currTheme]}>
      <Container>
        {currPage === 'WeatherCard' ? (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            dayOrNight={dayOrNight}
            fetchData={fetchData}
            handleCurrPageChange={handleCurrPageChange}
          />
        ) : (
          <WeatherSetting
            handleCurrPageChange={handleCurrPageChange}
            handleCurrCityChange={handleCurrCityChange}
            cityName={cityName}
          />
        )}
      </Container>
    </ThemeProvider>
  )
}

export default App;