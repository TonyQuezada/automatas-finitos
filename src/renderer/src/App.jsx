import { useState } from 'react'
import './App.css'
import { BotonMenu } from './components/botonMenu'
import { CrearAutomata } from './components/CrearAutomata'
import { ProbarCadenas } from './components/ProbarCadenas'

function App() {

  const [page, setPage] = useState("crear-automata");

  return (
    <div>
      <div>
        <h1 className='text-center text-5xl m-10 select-none items-center'>Autómatas Finitos</h1>

        <div className='flex justify-center m-3 items-center'>
          <BotonMenu text="Probar cadenas" onClick={() => setPage("probar-cadenas")}/>
          <BotonMenu text="Crear automata" onClick={() => setPage("crear-automata")}/>
        </div>
      </div>

      {page === "crear-automata" &&
        <CrearAutomata/>
      }
      {page === "probar-cadenas" &&
        <ProbarCadenas/>
      }

    </div>
  )
}

export default App
