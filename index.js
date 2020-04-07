const express = require('express')
const apiRouter = require('./api/router')
const server = express()

const port = 5000

server.use(express.json())
server.use('/api/posts', apiRouter)

server.listen(port, () => console.log('server listening on port localhost:5000'))