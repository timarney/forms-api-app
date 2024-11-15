'use client'

import { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone'
import { generateAccessToken } from '../api/actions';
import { cn } from '../util/cn';

const IDENTITY_PROVIDER_URL = "https://auth.forms-staging.cdssandbox.xyz";
const PROJECT_IDENTIFIER = "275372254274006635";
// const GCFORMS_API_URL = "https://api.forms-staging.cdssandbox.xyz";

const baseStyle = "border-2 border-dashed border-gray-300 rounded-md p-4";

const focusedStyle = "border-4 border-blue-600 cursor-move";

const acceptStyle = "border-4 border-blue-600 cursor-move";

const rejectStyle = "border-red-700 cursor-not-allowed line-through"

export const Form = () => {
    const onDrop = useCallback((acceptedFiles) => {
        console.log("on drop: ");
        acceptedFiles.forEach((file) => {
            const fileReader = new FileReader()
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = async (e) => {
                if (!e.target || !e.target.result || typeof e.target.result !== "string") return;
                const data = JSON.parse(e.target.result);
                const privateApiKey = data;
                const result = await generateAccessToken(IDENTITY_PROVIDER_URL, PROJECT_IDENTIFIER, privateApiKey);
                setAccessToken(result);
            }

        });

    }, [])

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDrop, accept: {
            'application/json': ['.json']
        }
    });

    const className = useMemo(() => (
        cn(baseStyle,
            isFocused && focusedStyle,
            isDragAccept && acceptStyle,
            isDragReject && rejectStyle
        )
    ), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    const [accessToken, setAccessToken] = useState<string | null>(null);

    if (accessToken) {
        return (
            <p>Access Token: ready</p>
        )
    }

    return (
        <div {...getRootProps({ className })}>
            <input {...getInputProps()} />
            <p className="">Drag and drop your API Key JSON file here, or click to select one</p>
        </div>
    )
}