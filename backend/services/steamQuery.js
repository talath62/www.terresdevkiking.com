const dgram = require('node:dgram')

const INFO_QUERY = Buffer.from('\xff\xff\xff\xffTSource Engine Query\x00', 'binary')
const CACHE_DURATION_MS = 15_000

let cachedResult = null
let cacheExpiresAt = 0
let pendingQuery = null

function readString(buffer, state) {
  const end = buffer.indexOf(0, state.offset)
  if (end === -1) throw new Error('Invalid A2S_INFO string')
  const value = buffer.toString('utf8', state.offset, end)
  state.offset = end + 1
  return value
}

function parseInfoResponse(buffer) {
  if (buffer.length < 6 || buffer.readInt32LE(0) !== -1 || buffer[4] !== 0x49) {
    throw new Error('Unexpected A2S_INFO response')
  }

  const state = { offset: 6 }
  const name = readString(buffer, state)
  const map = readString(buffer, state)
  readString(buffer, state) // folder
  readString(buffer, state) // game

  if (state.offset + 5 > buffer.length) throw new Error('Incomplete A2S_INFO response')
  state.offset += 2 // Steam app ID

  return {
    name,
    map,
    playersOnline: buffer[state.offset],
    maxPlayers: buffer[state.offset + 1],
    bots: buffer[state.offset + 2],
  }
}

function requestServerInfo(host, port, timeoutMs = 2500) {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4')
    let settled = false
    let challengeSent = false

    const finish = (error, result) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      socket.close()
      if (error) reject(error)
      else resolve(result)
    }

    const send = (packet) => {
      socket.send(packet, port, host, (error) => {
        if (error) finish(error)
      })
    }

    const timer = setTimeout(() => finish(new Error('Steam query timed out')), timeoutMs)

    socket.on('error', (error) => finish(error))
    socket.on('message', (message) => {
      if (message.length >= 9 && message.readInt32LE(0) === -1 && message[4] === 0x41 && !challengeSent) {
        challengeSent = true
        send(Buffer.concat([INFO_QUERY, message.subarray(5, 9)]))
        return
      }

      try {
        finish(null, parseInfoResponse(message))
      } catch (error) {
        finish(error)
      }
    })

    send(INFO_QUERY)
  })
}

async function getServerStats() {
  if (cachedResult && Date.now() < cacheExpiresAt) return cachedResult
  if (pendingQuery) return pendingQuery

  const host = process.env.STEAM_QUERY_HOST || 'server.terresdeviking.com'
  const port = Number(process.env.STEAM_QUERY_PORT || 2467)

  pendingQuery = requestServerInfo(host, port)
    .then((info) => ({
      ...info,
      status: 'online',
      host,
      port,
      checkedAt: new Date().toISOString(),
    }))
    .catch(() => ({
      playersOnline: 0,
      maxPlayers: Number(process.env.STEAM_MAX_PLAYERS || 50),
      status: 'offline',
      host,
      port,
      checkedAt: new Date().toISOString(),
    }))
    .then((result) => {
      cachedResult = result
      cacheExpiresAt = Date.now() + CACHE_DURATION_MS
      pendingQuery = null
      return result
    })

  return pendingQuery
}

module.exports = { getServerStats, requestServerInfo }
