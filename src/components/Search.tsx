import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { IconButton } from "@mui/material";
import axios from "axios";
import { useGlobalState } from "../contexts/WeatherContext";
import { Loader, useLoader } from "react-loader-ts";
import { Variant } from "react-loader-ts/lib/esm/components/Loader";



const useClickOutside = (element: any, callback: Function) => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (element.current && !element.current.contains(event.target as any)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
};

const Search = () => {
  const suggestionRef = useRef(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<string[]>([])
  const { setState } = useGlobalState();
  const { isLoading, setLoading } = useLoader();

  const searchCities = async (search: string) => {
    const baseUrl = "https://api.openweathermap.org/geo/1.0";
    const url = `${baseUrl}/direct?q=${search}&limit=10&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();
    setData(data)
    return data.map((item: any) => `${item.name}, ${item.country}`);
  };

  useEffect(() => {
    if (!searchTerm) {
      return;
    }
    setShowSuggestions(true);
    searchCities(searchTerm).then((res: React.SetStateAction<string[]>) => {
      setSuggestions(res);
    });
  }, [searchTerm]);

  const onSearchInputChanged = (e: any) => {
    setSearchTerm(e.target.value);
  };


  const changeCityData = (lat: string, lon: string) => {

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
    axios.get(apiUrl).then((resp) => {
      console.log('respones',resp)
      const data = resp.data;
      const id = resp.data.weather[0].id
      const country = resp.data.sys.country
      const city = resp.data.name
      const feelsLike = resp.data.main.feels_like
      const description = resp.data.weather.description
      const mainTemp = resp.data.main.temp
      const minTemp = resp.data.main.temp_min
      const maxTemp = resp.data.main.temp_max
      setState(() => ({...data, name: `${city}, ${country}`, id, mainTemp, minTemp, maxTemp, description, feelsLike }));
    });
  }

  const City = (item: any) => {
    const onClickCity = () => {
      setSearchTerm("")
      changeCityData(item.lat, item.lon)
    }

    return (
      <p className="py-1 px-10 cursor-pointer hover:bg-slate-300" onClick={onClickCity}>{item.name}, {item.country}</p>
    )

  }

  return (
    <div
      className="relative flex justify-between items-center border-2 rounded-[26px] bg-white dark:bg-slate-600 mt-8"
    >
      <div className="px-2">
        <SearchIcon />
      </div>
      <input
        className="w-full bg-none outline-none bg-transparent"
        placeholder="Search for a city"
        value={searchTerm}
        onChange={onSearchInputChanged}
      />
      <IconButton onClick={() =>{
          navigator.geolocation.getCurrentPosition(function(position) { 
            changeCityData(position.coords.latitude.toString(), position.coords.longitude.toString());
          });
        }}>
          {isLoading && <Loader variant={Variant.Dots}
  containerClassName="custom-container-class"
  containerStyle={{ backgroundColor: "red" }}
  loaderClassName="custom-loader-class"
  loaderStyle={{ width: "50px" }}/>}
        <LocationSearchingIcon sx={{ width: "15px", height: "15px" }} />
      </IconButton>
      {searchTerm &&
        <div className="absolute top-[110%] left-0 w-full bg-white/90 text-slate-600 backdrop-blur rounded-sm  z-50">
          {suggestions && data.map((item: any) => <City name={item.name} country={item.country} lat={item.lat} lon={item.lon} />)}
        </div>}
    </div>
  );
};

export default Search;