import { useState, useEffect, useRef } from 'react'

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [error, setError] = useState(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  useEffect(() => {
    if (!url) return

    const connect = () => {
      try {
        const ws = new WebSocket(url)
        
        ws.onopen = () => {
          console.log('WebSocket connected')
          setIsConnected(true)
          setError(null)
          reconnectAttempts.current = 0
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            setLastMessage(data)
          } catch (err) {
            console.error('Error parsing WebSocket message:', err)
          }
        }

        ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason)
          setIsConnected(false)
          
          // Attempt to reconnect
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++
            const delay = Math.pow(2, reconnectAttempts.current) * 1000 // Exponential backoff
            console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current})`)
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect()
            }, delay)
          } else {
            setError('Failed to reconnect after maximum attempts')
          }
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          setError('WebSocket connection error')
        }

        setSocket(ws)
      } catch (err) {
        console.error('Error creating WebSocket:', err)
        setError('Failed to create WebSocket connection')
      }
    }

    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socket) {
        socket.close()
      }
    }
  }, [url])

  const sendMessage = (message) => {
    if (socket && isConnected) {
      try {
        socket.send(JSON.stringify(message))
        return true
      } catch (err) {
        console.error('Error sending WebSocket message:', err)
        return false
      }
    }
    return false
  }

  const disconnect = () => {
    if (socket) {
      socket.close()
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
  }

  return {
    socket,
    isConnected,
    lastMessage,
    error,
    sendMessage,
    disconnect
  }
}

export default useWebSocket
