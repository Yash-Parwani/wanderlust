'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Waveform, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface VoiceSearchProps {
  isOpen: boolean
  onClose: () => void
  onResult: (text: string) => void
}

const VoiceSearch = ({ isOpen, onClose, onResult }: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const [isSupported, setIsSupported] = useState(false)

  // Initialize speech recognition when the modal opens
  useEffect(() => {
    if (!isOpen) return;

    try {
      // Check for browser support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported')
        setError('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.')
        return
      }
      
      setIsSupported(true)
      
      // Create new instance
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      // Set up event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      recognitionRef.current.onend = () => {

        setIsListening(false)
      }

      recognitionRef.current.onresult = (event: any) => {

        try {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('')


          setTranscript(transcript)
          
          if (event.results[0].isFinal) {

            onResult(transcript)
            setTimeout(() => {

              onClose()
            }, 1000)
          }
        } catch (err) {

          setError('Failed to process speech. Please try again.')
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        switch (event.error) {
          case 'not-allowed':
            setError('Microphone access denied. Please allow microphone access and try again.')
            break
          case 'no-speech':
            setError('No speech detected. Please try speaking again.')
            break
          case 'network':
            setError('Network error. Please check your internet connection.')
            break
          default:
            setError(`An error occurred: ${event.error}`)
        }
        setIsListening(false)
      }
    } catch (err) {
      console.error('Error setting up speech recognition:', err)
      setError('Failed to initialize speech recognition. Please try again.')
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (err) {
          console.error('Error cleaning up recognition:', err)
        }
      }
    }
  }, [isOpen, onClose, onResult])

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  
    if (!recognitionRef.current || !isSupported) {
      console.error('Recognition not available')
      return
    }

    setError(null)
    if (!isListening) {
   
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('Error starting recognition:', err)
        setError('Failed to start listening. Please try again.')
      }
    } else {
    
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('Error stopping recognition:', err)
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <Button
                variant="ghost"
                size="icon"
                disabled={!isSupported}
                className={`rounded-full w-16 h-16 transition-colors ${
                  isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'
                }`}
                onClick={toggleListening}
              >
                {isListening ? (
                  <div className="relative">
                    <MicOff className="w-8 h-8" />
                    <motion.div
                      className="absolute -inset-4 rounded-full border-2 border-red-500"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </Button>
            </div>

            <div className="text-center space-y-2">
              {error ? (
                <div className="flex items-center justify-center gap-2 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : isListening ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <Waveform className="w-4 h-4 text-purple-500 animate-pulse" />
                    <span className="text-sm font-medium">Listening...</span>
                  </div>
                  {transcript && (
                    <p className="text-sm text-gray-600 break-words">
                      "{transcript}"
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  {isSupported ? 'Click the microphone to start speaking' : 'Speech recognition is not supported'}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VoiceSearch 