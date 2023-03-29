const Discord = require('discord.js');
const moment = require('moment');

module.exports = (client, guild) => {
  const guildCreateChannel = client.channels.cache.get('1090718415200731177');
  if (!guildCreateChannel) return console.error('Unable to find channel.');

  const embed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setTitle(`New Guild: ${guild.name}`)
    .setDescription(`Guild ID: ${guild.id}`)
    .addField('Owner', `${guild.owner.user.tag} (${guild.ownerID})`, true)
    .addField('Members', `${guild.memberCount}`, true)
    .addField('Boosts', `${guild.premiumSubscriptionCount}`, true)
    .addField('Created At', `${moment(guild.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`, true);

  guildCreateChannel.send(embed);
};