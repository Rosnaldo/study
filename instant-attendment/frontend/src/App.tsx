import { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { collection, onSnapshot } from 'firebase/firestore'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { db } from '../Firebase'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const connectSocket = (): Socket => {
  const newSocket = io('http://localhost:3000', {
    autoConnect: false
  })
  newSocket.connect()

  return newSocket
}

const makeName = (length: number): string => {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

const userName = makeName(10)

function App() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [queueLength, setQueueLength] = useState<number | null>(null)
  const [meetLink, setMeetLink] = useState<string | null>(null)
  const [isMeInQueue, SetIsMeInQueeu] = useState<boolean>(false)
  
  useEffect(() => {
    const newSocket = connectSocket()
    newSocket.on('receive-link', ({ link }) => {
      console.log('receive-link', link)
      setMeetLink(link)
    })

    setSocket(newSocket)

    const unsubscribe = onSnapshot(collection(db, 'queue'), snapshot => {
      setQueueLength(snapshot.size)
    })

    return () => {
      unsubscribe()

      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  const handleGetInQueue = () => {
    SetIsMeInQueeu(true)
    socket?.emit('push-queue', { userName })
  }

  return (
    <Box>
      <Typography variant="h2">Instant Service</Typography>
      <Typography>Your Name: {userName}</Typography>
      {meetLink && <Typography>You have received a link: <Link href={meetLink} target="_blank">{meetLink}</Link></Typography>}
      <Typography>there is {queueLength} people in the queue</Typography>
      <Button onClick={handleGetInQueue} disabled={isMeInQueue}>get in the queue</Button>
    </Box>
  )
}

export default App
