const mineflayer = require('mineflayer')

const config = {
  host: '191.96.231.22',
  port: 12857,
  username: 'LordHM',
  version: '1.21.11'
}

let bot = null
let reconnecting = false

function createBot() {
  if (bot) return

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version
  })

  console.log('[Bot] Connecting...')

  let actionInterval = null

  bot.on('spawn', () => {
    console.log('[Bot] Spawned!')

    // Behavior loop (lebih natural)
    actionInterval = setInterval(() => {
      if (!bot || !bot.entity) return

      const action = Math.floor(Math.random() * 4)

      switch (action) {
        case 0:
          // Jalan random
          const directions = ['forward', 'back', 'left', 'right']
          const dir = directions[Math.floor(Math.random() * directions.length)]

          bot.setControlState(dir, true)

          setTimeout(() => {
            bot.setControlState(dir, false)
          }, 2000 + Math.random() * 2000)
          break

        case 1:
          // Liat sekitar
          const yaw = Math.random() * Math.PI * 2
          const pitch = (Math.random() - 0.5) * Math.PI
          bot.look(yaw, pitch, true)
          break

        case 2:
          // Lompat sekali
          bot.setControlState('jump', true)
          setTimeout(() => {
            bot.setControlState('jump', false)
          }, 500)
          break

        case 3:
          // Diam (biar natural)
          // no action
          break
      }
    }, 8000) // tiap 8 detik (AMAN & gak spam)
  })

  bot.on('end', () => {
    console.log('[Bot] Disconnected')
    cleanup(actionInterval)
    reconnect()
  })

  bot.on('kicked', (reason) => {
    console.log('[Bot] Kicked:', reason)
    cleanup(actionInterval)
    reconnect(true)
  })

  bot.on('error', (err) => {
    console.log('[Bot] Error:', err.message)
  })
}

function cleanup(interval) {
  if (interval) clearInterval(interval)
  bot = null
}

function reconnect(isKicked = false) {
  if (reconnecting) return
  reconnecting = true

  const delay = isKicked ? 20000 : 10000

  console.log(`[Bot] Reconnecting in ${delay / 1000}s...`)

  setTimeout(() => {
    reconnecting = false
    createBot()
  }, delay)
}

createBot()
