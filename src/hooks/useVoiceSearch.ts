"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type SpeechResult = ArrayLike<{ transcript: string }> & { isFinal: boolean };
type SpeechResultEvent = { results: ArrayLike<SpeechResult> };
type SpeechErrorEvent = { error: string };

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

let activeRecognition: SpeechRecognitionLike | null = null;

function getRecognitionConstructor(): SpeechRecognitionConstructor | null {
  const speechWindow = window as SpeechWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function subscribeToSpeechSupport(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);
  return () => {};
}

function errorMessage(error: string): string {
  switch (error) {
    case "not-allowed":
      return "No se permitió usar el micrófono. Revisa el permiso del navegador o escribe tu búsqueda.";
    case "service-not-allowed":
      return "El servicio de reconocimiento de voz no está disponible. Puedes escribir tu búsqueda.";
    case "no-speech":
      return "No se detectó voz. Puedes intentarlo de nuevo o escribir tu búsqueda.";
    case "audio-capture":
      return "No hay un micrófono disponible. Puedes escribir tu búsqueda.";
    case "network":
      return "El reconocimiento de voz necesita conexión en este momento. Puedes escribir tu búsqueda.";
    default:
      return "No se pudo reconocer la voz. Inténtalo de nuevo o escribe tu búsqueda.";
  }
}

export function useVoiceSearch(onTranscript: (value: string) => void) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const callbackRef = useRef(onTranscript);
  const supported = useSyncExternalStore(
    subscribeToSpeechSupport,
    () => Boolean(getRecognitionConstructor()),
    () => false,
  );
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      if (recognition) {
        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        if (activeRecognition === recognition) activeRecognition = null;
        recognition.abort();
      }
    };
  }, []);

  const toggleListening = useCallback(() => {
    const current = recognitionRef.current;
    if (current) {
      recognitionRef.current = null;
      if (activeRecognition === current) activeRecognition = null;
      current.abort();
      setListening(false);
      setMessage("Escucha cancelada. Puedes escribir o volver a intentarlo.");
      return;
    }

    const Constructor = getRecognitionConstructor();
    if (!Constructor) {
      return;
    }
    if (activeRecognition) {
      setMessage("Ya hay otra escucha en curso. Espera a que termine.");
      return;
    }

    const recognition = new Constructor();
    recognition.lang = "es-MX";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    activeRecognition = recognition;
    setListening(true);
    setMessage("Iniciando micrófono…");

    recognition.onstart = () => {
      if (recognitionRef.current === recognition) setMessage("Escuchando… habla ahora.");
    };
    recognition.onresult = (event) => {
      if (recognitionRef.current !== recognition) return;
      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result?.[0]?.transcript?.trim();
        if (result?.isFinal && transcript) {
          callbackRef.current(transcript);
          setMessage("Búsqueda por voz aplicada. Puedes corregir el texto escribiendo.");
          break;
        }
      }
    };
    recognition.onerror = (event) => {
      if (recognitionRef.current !== recognition) return;
      if (event.error !== "aborted") setMessage(errorMessage(event.error));
    };
    recognition.onend = () => {
      if (activeRecognition === recognition) activeRecognition = null;
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
        setListening(false);
        setMessage((previous) =>
          previous === "Escuchando… habla ahora." || previous === "Iniciando micrófono…"
            ? "No se obtuvo una búsqueda. Puedes volver a intentarlo o escribir."
            : previous,
        );
      }
    };

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      activeRecognition = null;
      setListening(false);
      setMessage("No se pudo iniciar el micrófono. Inténtalo de nuevo o escribe tu búsqueda.");
    }
  }, []);

  return { supported, listening, message, toggleListening };
}
