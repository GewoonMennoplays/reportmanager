const { MessageEmbed, SlashCommandBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Get the bot's ping and response time"),

    async execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle("🏓 Pong!")
            .setDescription(`API Ping: ${Math.round(interaction.client.ws.ping)}ms\nResponse Time: Loading...`)
            .setColor(config.colors.information);

        const sent = await interaction.reply({ embeds: [embed], fetchReply: true });
        const responseTime = sent.createdTimestamp - interaction.createdTimestamp;
        embed.setDescription(`API Ping: ${Math.round(interaction.client.ws.ping)}ms\nResponse Time: ${responseTime}ms`);
        sent.edit({ embeds: [embed] });
    },
};