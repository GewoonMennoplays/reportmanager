const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Get the bot's ping and response time"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Pinging...")
            .setDescription(`> API Ping: ${Math.round(interaction.client.ws.ping)}ms\n> Response Time: Loading...`)
            .setColor(config.colors.default)
            .setFooter({ text: 'Command issued by: ' + interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

        const sent = await interaction.reply({ embeds: [embed], fetchReply: true });
        const responseTime = sent.createdTimestamp - interaction.createdTimestamp;
        embed.setDescription(`> API Ping: ${Math.round(interaction.client.ws.ping)}ms\n> Response Time: ${responseTime}ms`);
        sent.edit({ embeds: [embed] });
    },
};