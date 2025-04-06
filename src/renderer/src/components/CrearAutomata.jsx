import React, { useState, useEffect, useCallback } from 'react';

// Component for selecting Starting and Ending states
function StateSelectionButtons({ numEstados, statePrefix = 'q', onStartingStateChange, onEndingStatesChange, currentStartingState, currentEndingStates }) {

    // Use useCallback to memoize the handlers to prevent unnecessary re-renders
    const handleStartingStateClick = useCallback((index) => {
        onStartingStateChange(statePrefix + index);
    }, [onStartingStateChange, statePrefix]);

    const handleEndingStateClick = useCallback((index) => {
        const stateName = statePrefix + index;
        onEndingStatesChange((prevEndingStates) => {
            if (prevEndingStates.includes(stateName)) {
                return prevEndingStates.filter((name) => name !== stateName);
            } else {
                return [...prevEndingStates, stateName];
            }
        });
    }, [onEndingStatesChange, statePrefix]);

    const states = Array.from({ length: numEstados }, (_, i) => statePrefix + i);
    const startingStateIndex = parseInt(currentStartingState.replace(statePrefix, ''), 10);
    const endingStateIndices = currentEndingStates.map(name => parseInt(name.replace(statePrefix, ''), 10));

    return (
        <>
            <div className="px-10 py-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 light:text-white">Estado Inicial</label>
                <div className="flex flex-wrap gap-2">
                    {states.map((state, index) => (
                        <button
                            key={index}
                            type="button" // Prevent form submission if wrapped in a form
                            className={`py-2 px-4 font-medium text-sm text-center rounded-lg ${startingStateIndex === index ? 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'}`}
                            onClick={() => handleStartingStateClick(index)}
                        >
                            {state}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-10 py-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 light:text-white">Estados Finales</label>
                <div className="flex flex-wrap gap-2">
                    {states.map((state, index) => (
                        <button
                            key={index}
                            type="button" // Prevent form submission if wrapped in a form
                            className={`py-2 px-4 font-medium text-sm text-center rounded-lg ${endingStateIndices.includes(index) ? 'bg-green-700 text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'}`}
                            onClick={() => handleEndingStateClick(index)}
                        >
                            {state}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

// Reusable Input Component for the Transition Table
function InputEstados({
    value,
    onChange,
    placeholder,
    isReadOnly = false,
    isHeader = false
}) {
    let backgroundColorClass = 'bg-gray-50'; // Default background
    if (isReadOnly && !isHeader) {
        backgroundColorClass = 'bg-gray-200'; // Darker gray for read-only state names
    } else if (isHeader) {
        backgroundColorClass = 'bg-gray-200'; // Darker gray for header cells
    }

    return (
        <input
            type="text"
            className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500 ${backgroundColorClass}`}
            required={!isReadOnly && !isHeader} // Only require editable cells
            value={value}
            placeholder={placeholder}
            readOnly={isReadOnly}
            onChange={onChange} // Pass the onChange handler
        />
    );
}

// Component for rendering one row of the transition table
function FuncionTransicionColumnas({
    numColumns,
    rowIndex,
    statePrefix,
    alphabet,
    transitions,
    handleAlphabetChange,
    handleTransitionChange
}) {
    const columnStyle = {
        // Add 1 for the state label column
        gridTemplateColumns: `repeat(${numColumns + 1}, minmax(0, 1fr))`,
    };

    const cells = [];
    const stateName = `${statePrefix}${rowIndex - 1}`; // Calculate state name (q0, q1, ...)

    // First Cell (Row Header or Corner Label)
    if (rowIndex === 0) {
        // Top-left corner label
        cells.push(
            <label
                key="label"
                htmlFor="estados-caracteres" // This id might not be useful here anymore
                className="block text-sm font-medium text-gray-900 light:text-white text-right self-center"
            >
                Estados / Caracteres
            </label>
        );
    } else {
        // State name label (read-only)
        cells.push(
            <InputEstados
                key={`${stateName}-label`}
                value={stateName}
                isReadOnly={true}
                isHeader={false} // It's a row header, but uses specific styling
            />
        );
    }

    // Remaining cells (Alphabet Headers or Transition Inputs)
    for (let colIndex = 0; colIndex < numColumns; colIndex++) {
        if (rowIndex === 0) {
            // Alphabet header input
            cells.push(
                <InputEstados
                    key={`alphabet-${colIndex}`}
                    placeholder={`Char ${colIndex + 1}`}
                    value={alphabet[colIndex] || ''}
                    isHeader={true}
                    onChange={(e) => handleAlphabetChange(colIndex, e.target.value)}
                />
            );
        } else {
            // Transition input cell
            const character = alphabet[colIndex];
            // Get current transition value, handle cases where state or char might not exist yet
            const currentValue = transitions[stateName]?.[character] || '';

            cells.push(
                <InputEstados
                    key={`${stateName}-char-${colIndex}`}
                    placeholder={`${statePrefix}?`} // e.g., q?
                    value={currentValue}
                    isReadOnly={false}
                    isHeader={false}
                    // Only allow changing if the alphabet character is defined
                    onChange={(e) => {
                        if (character !== undefined && character !== '') {
                             handleTransitionChange(stateName, character, e.target.value)
                        } else {
                            // Optional: Provide feedback that alphabet char needs to be set
                            console.warn("Cannot set transition for undefined alphabet character at index:", colIndex);
                        }
                    }}
                />
            );
        }
    }

    return (
        <div className="grid gap-6 mb-2 px-10" style={columnStyle}> {/* Reduced mb */}
            {cells}
        </div>
    );
}

// Component for rendering the complete transition table
function FuncionTransicionCompleta({
    numEstados,
    numCaracteres,
    statePrefix,
    alphabet,
    transitions,
    handleAlphabetChange,
    handleTransitionChange
}) {
    const rows = [];
    // Header Row (rowIndex = 0)
    rows.push(
        <FuncionTransicionColumnas
            key={-1}
            numColumns={numCaracteres}
            rowIndex={0}
            statePrefix={statePrefix}
            alphabet={alphabet}
            transitions={{}} // Not needed for header row
            handleAlphabetChange={handleAlphabetChange}
            handleTransitionChange={() => {}} // Not needed for header row
        />
    );

    // State Rows (rowIndex = 1 to numEstados)
    for (let i = 1; i <= numEstados; i++) {
        rows.push(
            <FuncionTransicionColumnas
                key={i-1}
                numColumns={numCaracteres}
                rowIndex={i} // Pass the actual row index (1-based for states)
                statePrefix={statePrefix}
                alphabet={alphabet}
                transitions={transitions}
                handleAlphabetChange={() => {}} // Not needed for state rows
                handleTransitionChange={handleTransitionChange}
            />
        );
    }
    return <>{rows}</>;
}

// Main component for creating the automaton
export function CrearAutomata() {
    const statePrefix = 'q'; // Define state prefix centrally

    // --- Basic Automaton Properties ---
    const [automatonName, setAutomatonName] = useState('');
    const [numCaracteres, setNumCaracteres] = useState(1);
    const [numEstados, setNumEstados] = useState(1);

    // --- State Selection ---
    const [startingState, setStartingState] = useState(`${statePrefix}0`); // Default 'q0'
    const [endingStates, setEndingStates] = useState([]); // Array of ending state names

    // --- Transition Table Data ---
    const [alphabet, setAlphabet] = useState(Array(numCaracteres).fill('')); // Array of alphabet characters
    const [transitions, setTransitions] = useState(() => { // Lazy initialization
       const initialTransitions = {};
       for (let i = 0; i < numEstados; i++) {
           initialTransitions[`${statePrefix}${i}`] = {};
       }
       return initialTransitions;
    });

    // --- Effects to Reset/Initialize based on numEstados/numCaracteres ---
    const initializeOrResetData = useCallback(() => {
        // Reset Alphabet Array
        const newAlphabet = Array(numCaracteres).fill('');
        setAlphabet(newAlphabet);

        // Reset Transitions Object
        const newTransitions = {};
        for (let i = 0; i < numEstados; i++) {
            newTransitions[`${statePrefix}${i}`] = {}; // Initialize states with empty transition objects
        }
        setTransitions(newTransitions);

        // Reset Starting State
        const defaultStartState = `${statePrefix}0`;
        setStartingState(defaultStartState);

        // Reset Ending States
        setEndingStates([]);

    }, [numEstados, numCaracteres, statePrefix]);

    // Run initialization/reset when dimensions change
    useEffect(() => {
        initializeOrResetData();
    }, [initializeOrResetData]); // Dependency array includes the memoized callback


    // --- Handlers for Basic Inputs ---
    const handleAutomatonNameChange = (event) => {
        setAutomatonName(event.target.value);
    };

    const handleCaracteresChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setNumCaracteres(value);
        } else if (event.target.value === '') {
            setNumCaracteres(0); // Allow clearing field, maybe default to 1 later
        }
    };

    const handleEstadosChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setNumEstados(value);
        } else if (event.target.value === '') {
            setNumEstados(0); // Allow clearing field, maybe default to 1 later
        }
    };

    // --- Handlers for State Selection (passed to StateSelectionButtons) ---
    // Direct setters are sufficient as StateSelectionButtons calculates the new state
    const handleStartingStateChange = setStartingState;
    const handleEndingStatesChange = setEndingStates;


    // --- Handlers for Transition Table (passed down) ---
    const handleAlphabetChange = useCallback((index, value) => {
        // Limit alphabet character input to a single character
        const singleCharValue = value.slice(-1); // Take only the last character entered

        setAlphabet(prev => {
            const newAlphabet = [...prev];
            const oldChar = newAlphabet[index];
            newAlphabet[index] = singleCharValue;

            // If the character changed, update keys in transitions
            if (oldChar !== singleCharValue && oldChar !== undefined && oldChar !== '') {
                setTransitions(prevTrans => {
                    const updatedTransitions = { ...prevTrans };
                    for (const state in updatedTransitions) {
                        if (updatedTransitions[state][oldChar] !== undefined) {
                            const destState = updatedTransitions[state][oldChar];
                            delete updatedTransitions[state][oldChar]; // Remove old key
                            if (singleCharValue !== '') { // Add new key only if new char is not empty
                                updatedTransitions[state][singleCharValue] = destState;
                            }
                        }
                    }
                    return updatedTransitions;
                });
            }
            return newAlphabet;
        });
    }, []); // No dependencies needed if logic is self-contained

    const handleTransitionChange = useCallback((fromState, character, toState) => {
        setTransitions(prev => {
            // Ensure the fromState exists in the transitions object
            const currentStateTransitions = prev[fromState] ? { ...prev[fromState] } : {};
            currentStateTransitions[character] = toState; // Update/add the transition

            return {
                ...prev,
                [fromState]: currentStateTransitions,
            };
        });
    }, []); // No dependencies needed

    // --- Save Handler ---
    const handleSave = () => {
        // 1. Validate alphabet: Ensure all characters are defined and unique
        const filledAlphabet = alphabet.slice(0, numCaracteres).filter(char => char !== '');
        if (filledAlphabet.length !== numCaracteres) {
            alert("Please fill in all alphabet characters.");
            return;
        }
        const uniqueAlphabet = new Set(filledAlphabet);
        if (uniqueAlphabet.size !== filledAlphabet.length) {
            alert("Alphabet characters must be unique.");
            return;
        }

        // 2. Structure the final data object according to the desired JSON format
        const finalTransitions = {};
        for (let i = 0; i < numEstados; i++) {
            const stateName = `${statePrefix}${i}`;
            const stateTransitions = transitions[stateName] || {};
            const finalStateTransitions = {};
            filledAlphabet.forEach(char => {
                // Ensure all defined alphabet characters have an entry, default to '' if missing
                finalStateTransitions[char] = stateTransitions[char] || '';
            });
             // Add only if the state actually exists (based on numEstados)
             finalTransitions[stateName] = finalStateTransitions;
        }


        const dataToSave = {
            "Nombre": automatonName || "Untitled Automaton", // Default name if empty
            "total-caracteres": numCaracteres,
            "total-estados": numEstados,
            "estado-inicio": startingState,
            "estados-finales": endingStates,
            ...finalTransitions // Spread the correctly structured transitions
        };

        // 3. Convert to JSON string
        const jsonString = JSON.stringify(dataToSave, null, 4); // Pretty print with 4 spaces

        // 4. Trigger download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Use automaton name for the file, sanitize it slightly, or use a default
        const filename = `${(automatonName || 'automaton').replace(/[^a-z0-9]/gi, '_')}.json`;
        a.download = filename;
        document.body.appendChild(a); // Append anchor to body
        a.click(); // Programmatically click the anchor to trigger download
        document.body.removeChild(a); // Remove anchor from body
        URL.revokeObjectURL(url); // Clean up the object URL

        console.log("Automaton data:", dataToSave);
    };


    // --- Render ---
    return (
        // Optionally wrap in a form if you want browser validation, but prevent default submit
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="px-10 py-3">
                <label htmlFor="nombre-automata" className="block mb-2 text-sm font-medium text-gray-900 light:text-white">Nombre del Autómata</label>
                <input
                    type="text"
                    id="nombre-automata"
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                    value={automatonName}
                    onChange={handleAutomatonNameChange}
                    placeholder="e.g., numerosBinarios"
                 />
            </div>
            <div className="px-10 py-3">
                <label htmlFor="caracteres" className="block mb-2 text-sm font-medium text-gray-900 light:text-white">Total de caracteres del alfabeto</label>
                <input
                    type="number"
                    id="caracteres"
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                    value={numCaracteres}
                    onChange={handleCaracteresChange}
                    min="1"
                />
            </div>
            <div className="px-10 py-3">
                <label htmlFor="estados" className="block mb-2 text-sm font-medium text-gray-900 light:text-white">Total de estados en el autómata</label>
                <input
                    type="number"
                    id="estados"
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                    value={numEstados}
                    onChange={handleEstadosChange}
                    min="1"
                />
            </div>

            <label htmlFor="transicion" className="block mb-2 text-sm font-bold text-gray-900 light:text-white px-10 pt-6">Función de transición</label>
            {/* Render table only if dimensions are valid */}
            {numEstados > 0 && numCaracteres > 0 && (
                 <FuncionTransicionCompleta
                    numEstados={numEstados}
                    numCaracteres={numCaracteres}
                    statePrefix={statePrefix}
                    alphabet={alphabet}
                    transitions={transitions}
                    handleAlphabetChange={handleAlphabetChange}
                    handleTransitionChange={handleTransitionChange}
                />
            )}


            {/* Render state selectors only if dimensions are valid */}
            {numEstados > 0 && (
                 <StateSelectionButtons
                    numEstados={numEstados}
                    statePrefix={statePrefix}
                    onStartingStateChange={handleStartingStateChange}
                    onEndingStatesChange={handleEndingStatesChange}
                    currentStartingState={startingState}
                    currentEndingStates={endingStates}
                />
            )}


            <button
                type="button" // Use type="button" to prevent form submission
                onClick={handleSave}
                className=" m-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Guardar Autómata en JSON
            </button>
        </form> // End optional form
    );
}

// Make sure to export CrearAutomata if it's the main component for this file
// export default CrearAutomata; // Or keep the named export as is