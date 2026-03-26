const mineflayer = require('mineflayer')

const config = {
  host: 'hamstersmp.mcsh.io',
  port: 12857,
  username: 'LordHM',
  password: 'HM123',
  version: '1.21.11'
}

function createBot() {
  const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version
  })

  bot.on('spawn', () => {
    console.log(`[LordHM] Bot spawned!`)
    
    // Auto login
    setTimeout(() => {
      bot.chat(`/login ${config.password}`)
    }, 2000)
  })

  bot.on('message', (message) => {
    const msg = message.toString()
    console.log(`[Chat] ${msg}`)
    
    // Auto register jika diminta
    if (msg.includes('register') || msg.includes('Register')) {
      bot.chat(`/register ${config.password} ${config.password}`)
    }
    
    // Auto login jika diminta
    if (msg.includes('login') || msg.includes('Login')) {
      bot.chat(`/login ${config.password}`)
    }
  })

  // Anti-AFK: jump setiap 25 detik
  setInterval(() => {
    bot.setControlState('jump', true)
    setTimeout(() => {
      bot.setControlState('jump', false)
    }, 500)
  }, 25000)

  // Anti-AFK: look random setiap 60 detik
  setInterval(() => {
    const yaw = Math.random() * Math.PI * 2
    const pitch = (Math.random() - 0.5) * Math.PI
    bot.look(yaw, pitch, true)
  }, 60000)

  bot.on('kicked', (reason) => {
    console.log(`[LordHM] Kicked: ${reason}`)
    setTimeout(createBot, 5000)
  })

  bot.on('error', (err) => {
    console.log(`[LordHM] Error: ${err}`)
    setTimeout(createBot, 5000)
  })

  bot.on('end', () => {
    console.log(`[LordHM] Disconnected, reconnecting in 5s...`)
    setTimeout(createBot, 5000)
  })
}

createBot()
