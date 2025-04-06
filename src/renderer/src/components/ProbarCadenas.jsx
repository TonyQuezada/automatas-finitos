import { leerJSON } from "../assets/leerJSON";
import { useState } from "react";
import { utilizarAutomata } from "../assets/utilizarAutomata";

export function ProbarCadenas() {
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const [cadenaFinal, setCadenaFinal] = useState("");
  const [resultado, setResultado] = useState("");

  const handleSeleccionarClick = async () => {
    // console.log("handleSeleccionarClick started"); // Log component handler
    setError(null);
    setArchivo(null); // Reset archivo state specifically
    setIsLoading(true);

    try {
    //   console.log("Calling leerJSON()..."); // Log before await
      const data = await leerJSON();
    //   console.log("leerJSON() resolved successfully:", data); // Log success
      setArchivo(data);
    } catch (err) {
      // Ensure err is an actual error object or create one
      const errorToShow = err instanceof Error ? err : new Error(String(err));
    //   console.error("Error caught in handleSeleccionarClick:", errorToShow); // Log error caught
      setError(errorToShow.message || "An unknown error occurred during file selection.");
      setArchivo(null); // Explicitly set archivo to null on error
    } finally {
    //   console.log("handleSeleccionarClick finished (finally block)"); // Log finally
      setIsLoading(false);
    }
  };

  return (
    <form action="" className="flex flex-col p-10 min-h-screen">
      <button
        type="button"
        className="m-10 mt-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
        onClick={handleSeleccionarClick}
        disabled={isLoading}
      >
        {isLoading ? "Cargando..." : "Seleccionar automata"}
      </button>

      {archivo &&
      <>
      <label
        htmlFor="cadena"
        className="text-lg block mb-2 font-medium text-gray-900 light:text-white mt-6"
      >
        Ingresa tu cadena para {archivo["Nombre"]}:
      </label>
      <input
        type="text"
        name="cadena"
        id="cadena"
        className="text-lg block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
        placeholder="e.g., abbab"
        value = {cadenaFinal}
        autoComplete="off"
        onChange={e => {setCadenaFinal(e.target.value); setResultado( () => utilizarAutomata(archivo, e.target.value))}}
      />
    {
        resultado == "Cadena Válida" ? 
        <label
            htmlFor="cadena"
            className="text-green-500 text-lg block mb-7 font-medium light:text-white mt-6"
            >
            {resultado}
        </label>
        :
        <label
            htmlFor="cadena"
            className="text-red-600 text-lg block mb-7 font-medium light:text-white mt-6"
            >
            {resultado}
        </label>
    }

      </>}

      {/* Display Error Message */}
      {error && (
        <div className="m-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      {/* Display Loading State (Optional but helpful) */}
      {isLoading && <div className="m-4 text-gray-600">Seleccionando archivo...</div>}

      {/* Display Loaded JSON - Ensure archivo is not null AND there's no error */}
      {archivo && !error && (
        <div className="m-4 p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Automata seleccionado:</h2>
            {/* Check if archivo is actually an object before stringifying */}
            {typeof archivo === 'object' && archivo !== null ? (
                 <pre className="text-sm overflow-auto max-h-60">
                    <code>{JSON.stringify(archivo, null, 2)}</code>
                 </pre>
            ) : (
                 <p className="text-sm text-red-500">El autómata seleccionado no es válido.</p>
            )}

        </div>
      )}
      
    </form>
  );
}