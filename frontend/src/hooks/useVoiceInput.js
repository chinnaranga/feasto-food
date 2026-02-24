import { useState, useRef, useEffect } from "react";

export function useVoiceInput(onResult) {
    const recognitionRef = useRef(null);
    const [listening, setListening] = useState(false);
    const [error, setError] = useState(null);

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Voice input not supported on this browser");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setListening(true);
            setError(null);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };

        recognition.onerror = (e) => {
            setError(e.error);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setListening(false);
    };

    // Cleanup on unmount
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    return {
        listening,
        error,
        startListening,
        stopListening,
    };
}
