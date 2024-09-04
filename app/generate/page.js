'use client'
import { Box, Button, Stack, TextField, AppBar, Toolbar, Typography} from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';

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
    <>
    <AppBar position="static" sx={{ backgroundColor: 'rgba(0, 0, 0)' }}>
        <Toolbar>
          <Link href="/" passHref>
            <Button>
              <Typography variant="h5" sx={{ fontFamily: 'Montserrat, sans-serif', color: 'rgb(255, 255, 255)'}} style={{ flexGrow: 1 }}>
                RateMyMentor @ HeadstarterAI
              </Typography>
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: 'linear-gradient(290deg, #213363, #000000)',
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite'
      }}
    >
      <Stack
        direction={'column'}
        width="1000px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Makes the chat container semi-transparent
          borderRadius: 2
        }}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
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
                sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600,}}
                bgcolor={
                  message.role === 'assistant'
                    ? 'rgb(0, 0, 0)'
                    : 'rgb(0, 227, 178)'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            sx={{ fontFamily: 'Montserrat, sans-serif'}}
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage} sx={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: 'rgb(0, 227, 178)',
                '&:hover': {
                  backgroundColor: 'rgba(142, 252, 228)',
                  transform: 'scale(1.05)',
                },}}>
            Send
          </Button>
        </Stack>
      </Stack>

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
    </>
  )
}
