import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { Socket, io } from 'socket.io-client'

import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import { IClient } from './client'
import { db } from '../Firebase'
import { toEntity } from './to-entity'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
}

const connectSocket = (): Socket => {
  const newSocket = io('http://localhost:3000', {
    autoConnect: false
  })
  newSocket.connect()

  return newSocket
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [open, setOpen] = useState(false)
  
  const [queue, setQueue] = useState<IClient[]>([])
  const [meetLink, setMeetLink] = useState<string>('')
  const [inAttendment, setInAttendment] = useState<IClient | null>(null)

  const handleOpen = () => {
    socket?.emit('admin-get-next-in-queue')
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleSendLink = () => {
    socket?.emit('admin-sent-link', { link: meetLink, socketId: inAttendment?.socketId })
  }

  useEffect(() => {
    const newSocket = connectSocket()
    newSocket.on('admin-receive-next-in-queue', (client) => {
      setInAttendment(client)
    })
    setSocket(newSocket)

    const unsubscribe = onSnapshot(collection(db, 'queue'), snapshot => {
      const data = snapshot.docs
      .map(docSnap => ({ ...docSnap.data(), id: docSnap.id }) as any)
      .map(toEntity)
      setQueue(data)
    })

    return () => {
      unsubscribe()

      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  return (
    <div>
      <Typography variant="h2">You are the admin</Typography>
      <Typography>there are {queue.length} people in the queue</Typography>
      {
        queue.map((client) => <Typography key={client.id}>{client.name}</Typography>)
      }
      <Button onClick={handleOpen}>meet the next in the queue</Button>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          {inAttendment && <Typography variant="h6">
            You are attending {inAttendment.name}
          </Typography>}
          <Box>
            <TextField onChange={(e) => setMeetLink(e.target.value)} value={meetLink} label="meet link" variant="outlined" />
          </Box>
          <Button onClick={handleSendLink}>send meet to client</Button>
        </Box>
      </Modal>
    </div>
  )
}

export default App
