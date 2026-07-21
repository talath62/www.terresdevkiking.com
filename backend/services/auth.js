const crypto = require('crypto')
const db = require('./database')

const SESSION_COOKIE = 'tdv_valhalla_session'
const STATE_COOKIE = 'tdv_valhalla_oauth'
const SESSION_DAYS = 30

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
    const index = part.indexOf('=')
    return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))]
  }))
}

function cookieOptions(req, maxAge) {
  const secure = req.get('x-forwarded-proto') === 'https' || req.secure
  return { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge }
}

function createSession(req, res, userId) {
  const token = crypto.randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000)
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(hash(token), userId, expiresAt.toISOString())
  res.cookie(SESSION_COOKIE, token, cookieOptions(req, SESSION_DAYS * 86400000))
}

function destroySession(req, res) {
  const token = parseCookies(req.get('cookie'))[SESSION_COOKIE]
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hash(token))
  res.clearCookie(SESSION_COOKIE, cookieOptions(req, 0))
}

function getUser(req) {
  const token = parseCookies(req.get('cookie'))[SESSION_COOKIE]
  if (!token) return null
  return db.prepare(`
    SELECT users.* FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?
  `).get(hash(token), new Date().toISOString()) || null
}

function requireUser(req, res, next) {
  const user = getUser(req)
  if (!user) return res.status(401).json({ error: 'AUTH_REQUIRED', message: 'Connexion Google requise' })
  req.user = user
  next()
}

function requireAdmin(req, res, next) {
  const user = getUser(req)
  if (!user) return res.status(401).json({ error: 'AUTH_REQUIRED', message: 'Connexion Google requise' })
  if (user.role !== 'admin') return res.status(403).json({ error: 'ADMIN_REQUIRED', message: 'Accès administrateur requis' })
  req.user = user
  next()
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url,
    playerName: user.player_name,
    role: user.role,
    tickets: user.tickets,
  }
}

module.exports = {
  STATE_COOKIE,
  cookieOptions,
  createSession,
  destroySession,
  getUser,
  hash,
  parseCookies,
  publicUser,
  requireAdmin,
  requireUser,
}
