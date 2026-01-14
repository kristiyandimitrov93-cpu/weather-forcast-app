import { useEffect, useState } from 'react'
import './App.css'
import { useGeolocation, type LocationCoordinates } from './hooks/useGeolocation'
import { Button } from "@/components/ui/button"
import { useWeather } from './hooks/useWeather'
import { Forecast } from './components/forecast/Forecast'
import { Input } from './components/ui/input'



function App() {
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [cityQuery, setCityQuery] = useState('')
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  const { location, getLocation } = useGeolocation()
  const {
    data,
    isLoading: isWeatherLoading
  } = useWeather(coordinates || undefined, city || undefined);

  useEffect(() => {
    if (location) {
      setCity("");
      setCoordinates(location);
      setSelectedDayIndex(null);
    }
  }, [location]);


  const handleSelectDay = (index: number) => {

    setSelectedDayIndex(selectedDayIndex === index ? null : index);
  };

  const handleOnCityClick = () => {
    setCoordinates(null);
    setCity(cityQuery.trim());
    setSelectedDayIndex(null);
  }

  const handleUseMyLocationClick = () => {
    setSelectedDayIndex(null);
    setCity(null);
    setCityQuery('')
    getLocation()
  }





  return (
    <>
      <div className="flex flex-col h-dvh overflow-hidden">
        <div className="flex items-center gap-4 max-w-xl mx-auto shrink-0">

          <div className="flex gap-2">
            <Input
              placeholder="Enter city (e.g. Sofia)"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              className="w-48"
            />
            <Button disabled={cityQuery === ""} onClick={handleOnCityClick}>
              Search
            </Button>
          </div>


          <div className="flex items-center gap-2">
            <div className="h-px w-6 bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Or
            </span>
            <div className="h-px w-6 bg-border" />
          </div>


          <Button onClick={handleUseMyLocationClick} >
            Use my location
          </Button>
        </div>


        <div className="flex-1 overflow-hidden p-4">
          {!isWeatherLoading && data && <Forecast weatherSummaries={data} selectedDayIndex={selectedDayIndex} onHandleSelectDay={handleSelectDay} />}
        </div>


      </div>

    </>

  )
}

export default App
