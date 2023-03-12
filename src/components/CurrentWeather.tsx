import React, { useContext, useRef, useState } from "react";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { useGlobalState } from "../contexts/WeatherContext";
import WeatherIcon from "./WeatherIcon";

const label = { inputProps: { "aria-label": "Color switch demo" } };
const baseUrl = "https://api.openweathermap.org/data/2.5";

export const fetchWeatherData = async (
  city: string | { lat: number; lng: number }
) => {
  let url = `${baseUrl}/weather?q=${city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

  if (typeof city === "object") {
    url = `${baseUrl}/weather?lat=${city.lat}&lon=${city.lng}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
  }
  return await (await fetch(url)).json();
};
export const CurrentWeather = () => {
  const { state } = useGlobalState();

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="w-full rounded-[26px] bg-white p-4 dark:bg-slate-600 border-2 mt-8">
      <div className="flex justify-between items-center">
        <span>Current Weather</span>
        <div>
          <span>F</span>
          <Switch
            color="default"
            size="small"
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
          <span>C</span>
        </div>
      </div>

      <p></p>
      <div className="grid grid-cols-2">
        <div>
          <span>{state.name && state.name}</span>
          <div className="grid grid-cols-2">
            <div>
              <WeatherIcon code={state.id} />
            </div>
            <div>
              {state.mainTemp &&
                `${
                  checked
                    ? Math.round(state.mainTemp - 273.15)
                    : Math.round(state.mainTemp - 241.15)
                }`}
              <sup>&deg;</sup>
            </div>
          </div>
          <span>{state.description && state.description}</span>
        </div>
        <div>
          <div className="grid grid-cols-2">
            <span>Feels like</span>
            <div>
              {state.feelsLike &&
                `${
                  checked
                    ? Math.round(state.feelsLike - 273.15)
                    : Math.round(state.feelsLike - 241.15)
                }`}
              <sup>&deg;</sup>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <span>Max</span>
            </div>
            <div>
              {state.maxTemp &&
                `${
                  checked
                    ? Math.round(state.maxTemp - 273.15)
                    : Math.round(state.maxTemp - 241.15)
                }`}
              <sup>&deg;</sup>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <span>Min</span>
            </div>
            <div>
              {state.minTemp &&
                `${
                  checked
                    ? Math.round(state.minTemp - 273.15)
                    : Math.round(state.minTemp - 241.15)
                }`}
              <sup>&deg;</sup>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CurrentWeather;
function userOutsideClick(arg0: never, arg1: () => void) {
  throw new Error("Function not implemented.");
}
