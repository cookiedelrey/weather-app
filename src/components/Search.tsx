import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { Backdrop, CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import { useGlobalState } from "../contexts/WeatherContext";
import { Loader, useLoader } from "react-loader-ts";
import { Variant } from "react-loader-ts/lib/esm/components/Loader";

const Search = () => {
  const suggestionRef = useRef(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<string[]>([]);
  const { setState } = useGlobalState();
  const { isLoading, setLoading } = useLoader();
  const { state } = useGlobalState();

  const searchCities = async (search: string) => {
    const baseUrl = "https://api.openweathermap.org/geo/1.0";
    const url = `${baseUrl}/direct?q=${search}&limit=10&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();
    setData(data);
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
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
    axios.get(apiUrl).then((resp) => {
      // console.log("respones", resp);
      const data = resp.data;
      const id = resp.data.weather[0].id;
      const country = resp.data.sys.country;
      const city = resp.data.name;
      const feelsLike = resp.data.main.feels_like;
      const description = resp.data.weather.description;
      const mainTemp = resp.data.main.temp;
      const minTemp = resp.data.main.temp_min;
      const maxTemp = resp.data.main.temp_max;
      setState(() => ({
        ...data,
        name: `${city}, ${country}`,
        id,
        mainTemp,
        minTemp,
        maxTemp,
        description,
        feelsLike,
      }));
    });
  };

  const City = (item: any) => {
    const onClickCity = () => {
      setSearchTerm("");
      changeCityData(item.lat, item.lon);
    };

    return (
      <p
        className="py-1 px-10 cursor-pointer hover:bg-slate-300"
        onClick={onClickCity}
      >
        {item.name}, {item.country}
      </p>
    );
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (state.id) {
      setOpen(false);
    }
  });

  const [outside, setOutside] = React.useState(true);

  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      const item:any = data[0]
      setSearchTerm("");
      changeCityData(item.lat, item.lon);
    }
  };

  return (
    <div className="relative flex justify-between items-center border-2 rounded-[26px] p-2 text-lg bg-white dark:bg-slate-600 mt-8">
      <div className="px-2">
        <SearchIcon />
      </div>
      <input
        className="w-full bg-none outline-none bg-transparent"
        placeholder="Search for a city"
        value={searchTerm}
        onClick={() => setOutside(true)}
        onKeyDown={handleKeyDown}
        onChange={onSearchInputChanged}
      />
      <IconButton
        onClick={() => {
          setOpen(true);
          navigator.geolocation.getCurrentPosition(function (position) {
            changeCityData(
              position.coords.latitude.toString(),
              position.coords.longitude.toString()
            );
          });
        }}
      >
        <LocationSearchingIcon sx={{ width: "15px", height: "15px" }} />
      </IconButton>
      {searchTerm && (
        <div>
          {outside && (
            <>
              <div className="absolute top-[110%] left-0 w-full bg-white/90 text-slate-600 backdrop-blur rounded-sm  z-50">
                {suggestions &&
                  data.map((item: any) => (
                    <City
                      name={item.name}
                      country={item.country}
                      lat={item.lat}
                      lon={item.lon}
                    />
                  ))}
              </div>
              <div
                onClick={() => setOutside(false)}
                className="fixed top-0 left-0 w-screen h-screen "
              />
            </>
          )}
        </div>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Search;
