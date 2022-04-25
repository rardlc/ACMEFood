import { useState, useCallback } from 'react'

export function useCoolerState(initialValue) {
    const [value, setValue] = useState(initialValue)

    const theCoolerSetValue = useCallback(
        (newValue) => {
            setValue(newValue)
            setSignature(nanoid())
        },
        [signature]
    )

    return [
        value,
        theCoolerSetValue,
        signature
    ]
}