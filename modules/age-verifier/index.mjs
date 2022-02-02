import onGuilMemberAdd from './on-guild-member-add.mjs'

export default (client) => {
  const guilds = client.guilds.cache
  for (const guild of guilds.values()) {
    console.log(`Starting age verifier for server ${guild.name}...`)
    client.on('guildMemberAdd', onGuilMemberAdd(client, guild))
  }
}
