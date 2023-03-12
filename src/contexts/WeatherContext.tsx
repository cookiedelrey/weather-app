import axios from "axios";
import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

export interface GlobalStateInterface {
  name: string,
  country: string,
  description: string,
  feelsLike: number,
  icon: any,
  mainTemp: number,
  minTemp: number,
  maxTemp: number,
  id: number,
}

const GlobalStateContext = createContext({
  state: {} as Partial<GlobalStateInterface>,
  setState: {} as Dispatch<SetStateAction<Partial<GlobalStateInterface>>>,
});


const GlobalStateProvider = ({
  children,
  value = {} as GlobalStateInterface,
}: {
  children: React.ReactNode;
  value?: Partial<GlobalStateInterface>;
}) => {
  const [state, setState] = useState(value);
  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateContext");
  }
  return context;
};

export { GlobalStateProvider, useGlobalState };

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
  }
  function fetchWeather(arg0: { lat: any; lng: any; }): any {
    throw new Error("Function not implemented.");
  }

