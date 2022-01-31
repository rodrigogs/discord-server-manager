export default (client) => new Promise((resolve, reject) => {
  client.once('ready', resolve)
  client.once('error', reject)
})
