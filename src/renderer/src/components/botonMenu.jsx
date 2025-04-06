import { useState } from 'react'

export function BotonMenu({text, onClick}){

    return (
                <button type="button"
                className='select-none bg-blue-700 m-1 p-2 rounded-xl bold hover:bg-blue-800 active:bg-blue-900 text-white font-medium flex-row w-100 h-20 justify-center items-center text-xl'
                onClick = {onClick}
                >{text}</button>
    );
}