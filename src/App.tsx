import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useGeolocation } from './hooks/useGeolocation'
import { Button } from "@/components/ui/button"
import { useWeather } from './hooks/useWeather'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Forecast } from './components/forecast/Forecast'



function App() {
  const [count, setCount] = useState(0)

  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);


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
      <div className="card">
        <Button variant="outline" onClick={() => getLocation()}>
          Use my location
        </Button>

        {!isWeatherLoading && <Forecast weatherSummaries={data} selectedDayIndex={selectedDayIndex} onHandleSelectDay={handleSelectDay} />}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

    </>

  )
}

export default App
