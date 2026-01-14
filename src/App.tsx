import { useState } from 'react'
import './App.css'
import { useGeolocation } from './hooks/useGeolocation'
import { Button } from "@/components/ui/button"
import { useWeather } from './hooks/useWeather'
import { Forecast } from './components/forecast/Forecast'
import { Input } from './components/ui/input'



function App() {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [city, setCity] = useState("");


  const handleSelectDay = (index: number) => {
    debugger
    setSelectedDayIndex(selectedDayIndex === index ? null : index);
  };
  const { isLoading, error, location, getLocation } = useGeolocation()
  console.log(isLoading)
  console.log(error)
  console.log(location)


  const {
    data,
    isLoading: isWeatherLoading
  } = useWeather(location || undefined);

  return (
    <>
      <div className="flex flex-col h-dvh overflow-hidden">
        <div className="flex items-center gap-4 max-w-xl mx-auto shrink-0">

          <div className="flex gap-2">
            <Input
              placeholder="Enter city (e.g. Sofia)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-48"
            />
            <Button variant="outline" disabled={city === ""} onClick={() => city.trim() && setCity(city.trim())}>
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


          <Button variant="outline" onClick={getLocation}>
            Use my location
          </Button>
        </div>


        <div className="flex-1 overflow-hidden p-4">
          {!isWeatherLoading && <Forecast weatherSummaries={data} selectedDayIndex={selectedDayIndex} onHandleSelectDay={handleSelectDay} />}
        </div>


      </div>

    </>

  )
}

export default App
