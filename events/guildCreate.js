const Discord = require('discord.js');
const moment = require('moment');
const mysql = require('mysql2');

const client = new Discord.Client();
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydatabase'
});

client.on('guildCreate', guild => {

  const embed = new Discord.MessageEmbed()
    .setTitle(`Joined guild: ${guild.name}`)
    .addFields(
      { name: 'Guild ID', value: guild.id, inline: true },
      { name: 'Guild Owner', value: `${guild.owner.user.username}#${guild.owner.user.discriminator} (ID: ${guild.owner.id})`, inline: true },
      { name: 'Member Count', value: guild.memberCount, inline: true },
      { name: 'Boost Count', value: guild.premiumSubscriptionCount, inline: true },
      { name: 'Join Date', value: moment(guild.joinedAt).format('MMM Do YYYY, h:mm:ss a'), inline: true }
      )

  client.channels.cache.get('1090718415200731177').send(embed);

  const query = `INSERT INTO guilds (guild_name, guild_id, owner_name, owner_id, is_blacklisted) VALUES (?, ?, ?, ?, ?)`;
  const values = [guild.name, guild.id, guild.owner.user.username, guild.owner.id, false];
  
  connection.query(query, values, (error, results, fields) => {
    if (error) throw error;
    console.log(`Added guild ${guild.name} to database.`);
  });
});