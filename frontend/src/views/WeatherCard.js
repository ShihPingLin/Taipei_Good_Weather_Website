import React from 'react';
import styled from '@emotion/styled';
import moment from 'moment';
import 'moment/locale/zh-tw';

import WeatherIcon from '../components/WeatherIcon';
import { ReactComponent as AirFlowIcon } from '../images/airFlow.svg';
import { ReactComponent as RainIcon } from '../images/rain.svg';
import { ReactComponent as RefreshIcon } from '../images/refresh.svg';
import { ReactComponent as LoadingIcon } from '../images/loading.svg';
import { ReactComponent as CogIcon } from '../images/cog.svg';

const WeatherCardWrapper = styled.div`
  position: relative;  
  min-width: 300px;  
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 10px;
`

const Comfortability = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const Temperature = styled.div`
  color: ${({ theme }) => theme.terperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }
`

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`

const WeatherCard = ({ cityName, weatherElement, dayOrNight, fetchData, handleCurrPageChange }) => {
  const {
    description,
    windSpeed,
    temperature,
    rainPossibility,
    observationTime,
    comfortability,
    isLoading,
    weatherCode,
  } = weatherElement;

  return (
    <WeatherCardWrapper>
      <Cog onClick={() => handleCurrPageChange('WeatherSetting')} />
      <Location>{cityName}</Location>
      <Description>{description}</Description>
      <Comfortability>{comfortability}</Comfortability>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)} <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon weatherCode={weatherCode} dayOrNight={dayOrNight} />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon /> {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon /> {rainPossibility}%
      </Rain>
      <Refresh isLoading={isLoading}>
        最後觀測時間： {moment(observationTime).format('a h:mm')}
        {isLoading ?
          <LoadingIcon /> :
          <RefreshIcon onClick={() => fetchData()} />}
      </Refresh>
    </WeatherCardWrapper>
  );
}

export default WeatherCard;