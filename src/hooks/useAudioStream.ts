import { useRef, useCallback, useState } from 'react';

export function useAudioStream() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const startRecording = useCallback(async (onAudioData: (base64Data: string) => void) => {
    const context = initAudioContext();
    if (context.state === 'suspended') {
      await context.resume();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const source = context.createMediaStreamSource(stream);
      
      // Live API expects 16000Hz PCM
      const processor = context.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Resample/Convert to 16bit PCM if needed, but for simplicity we can send as is if model supports it
        // The skill says: audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        // We need to convert Float32Array to Int16Array and then base64
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        onAudioData(base64Data);
      };

      source.connect(processor);
      processor.connect(context.destination);
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  }, [initAudioContext]);

  const stopRecording = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const nextStartTimeRef = useRef<number>(0);

  const playPCM = useCallback(async (base64Data: string, sampleRate: number = 16000) => {
    const context = initAudioContext();
    if (context.state === 'suspended') {
      await context.resume();
    }

    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }

    const buffer = context.createBuffer(1, floatData.length, sampleRate);
    buffer.getChannelData(0).set(floatData);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);

    const currentTime = context.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
    
    return source;
  }, [initAudioContext]);

  const stopPlayback = useCallback(() => {
    nextStartTimeRef.current = 0;
  }, []);

  return {
    startRecording,
    stopRecording,
    playPCM,
    stopPlayback,
    isRecording,
    audioContext: audioContextRef.current
  };
}
