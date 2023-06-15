const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const socketIo = require('socket.io')
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore,  } = require('firebase-admin/firestore')
const serviceAccount = require('./instant-service-9a6ca-firebase-adminsdk-r9vlf-62209d0631.json')

initializeApp({ credential: cert(serviceAccount) })

app.use(cors())

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
    ]
  }
})

const db = getFirestore()
const collecQueue = db.collection('queue')
const collecClientInAttendment = db.collection('client-in-attendment')

io.on('connection', (socket) => {
  console.log('Usuário conectado!', socket.id)

  socket.on('admin-sent-link', ({ link, socketId }) => {
    console.log(socketId)
    socket.to(socketId).emit('receive-link', { link })
  })

  socket.on('admin-get-next-in-queue', () => {
    collecClientInAttendment
      .get()
      .then(querySnapshot => {
        querySnapshot.docs[0].data().clientRef.get().then((snap) => {
          const client = snap.data()
          socket.emit('admin-receive-next-in-queue', client)
        })
      })
  })

  socket.on('push-queue', ({ userName }) => {
    collecQueue.count().get().then((length) => {
      const position = length.data().count + 1
      const socketId = socket.id
      collecQueue.add({
        userName,
        socketId,
        position,
      }).then(client => {
        if (position === 1) {
          collecClientInAttendment.add({
            clientRef: db.doc(`queue/${client.id}`)
          })
        }
      })
    })
  })

  socket.on('disconnect', _reason => {
    console.log('disconnect ', socket.id)
    collecQueue
      .where('socketId', '==', socket.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete()
        })
      })
      collecClientInAttendment
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete()
        })
      })
  })
})

const port = 3000

server.listen(port, () => console.log(`This app is listening on port ${port}`))

const handleExit = () => {
  collecQueue
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete()
      })
    })
    .then(io.close())
    .then(server.closeAllConnections())
}

process.on('exit', handleExit);

//catches ctrl+c event
process.on('SIGINT', handleExit);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', handleExit);

process.on('SIGUSR2', handleExit)

process.on('SIGTERM', handleExit)

process.on('uncaughtException', handleExit)
