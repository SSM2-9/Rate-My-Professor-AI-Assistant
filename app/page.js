'use client'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    if (message.trim() === '') return // Prevent sending empty messages

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let result = ''

      reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
        return reader.read().then(processText)
      })
    } catch (error) {
      console.error("Error fetching chat response:", error)
      setMessages((messages) => [
        ...messages,
        {
          role: 'assistant',
          content: "Sorry, there was an error processing your request.",
        },
      ])
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: 'linear-gradient(135deg, #00E3B2, #000000, #000000, #8EFCE4)',
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite',
      }}
    >
      {/* Header */}
      <Box
        width="100%"
        py={4}
        bgcolor="black"
        color="white"
        display="flex"
        justifyContent="center"
      >
        <Typography variant="h4">Rate My Professor - Chat Assistant</Typography>
      </Box>

      {/* Chat Container */}
      <Stack
        direction={'column'}
        width="500px"
        height="600px"
        border="1px solid black"
        p={2}
        m={2}
        spacing={3}
        sx={{
          backgroundColor: 'black',
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{
            padding: '10px',
            backgroundColor: '#1A1A1A',
            borderRadius: 2,
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                sx={{
                  backgroundColor:
                    message.role === 'assistant' ? '#00E3B2' : '#FFFFFF',
                  color: message.role === 'assistant' ? 'black' : 'black',
                  borderRadius: 2,
                  padding: '10px 15px',
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              input: { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: '#00E3B2' },
              },
            }}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>

      {/* Add the keyframes for the gradient animation */}
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </Box>
  )
}
