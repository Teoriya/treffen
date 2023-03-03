import { useState, useCallback ,useRef, useEffect} from 'react';

export const useStateCallback = (initialState) => {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null); // mutable ref to store current callback
    
    const setStateCallback = useCallback((state, cb) => {
        cbRef.current = cb; // store passed callback to ref
        setState(state); // may have to change this and use a function to get the previous state and pass it to the callback ;not sure
    }, []);
    
    useEffect(() => { 
        if (cbRef.current) {
        cbRef.current(state);
        cbRef.current = null;
        }
    }, [state]);
    
    return [state, setStateCallback];
    }
