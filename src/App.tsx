import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useGeolocation } from './hooks/useGeolocation'
import { Button } from "@/components/ui/button"
import { useWeather } from './hooks/useWeather'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  const [count, setCount] = useState(0)

  const { isLoading, error, location, getLocation } = useGeolocation()
  console.log(isLoading)
  console.log(error)
  console.log(location)


  const {
    data
  } = useWeather(location || undefined);

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <Button variant="outline" onClick={() => getLocation()}>
            count is {count}
          </Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    </QueryClientProvider>
  )
}

export default App
