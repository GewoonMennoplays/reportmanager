const { EmbedBuilder, MessageSelectMenu, MessageActionRow, SlashCommandBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Displays the list of available commands"),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor(config.colors.information)
            .setTitle("Help")
            .setDescription("Please choose a category from the dropdown menu below.")
            .setFooter("Bot by your name");

        const categorySelectMenu = new MessageSelectMenu()
            .setCustomId("category-select-menu")
            .setPlaceholder("Select a category")
            .addOptions([
                {
                    label: "General Commands",
                    value: "general"
                },
                {
                    label: "Owner Commands",
                    value: "owner"
                }
            ]);

        const row = new MessageActionRow().addComponents([categorySelectMenu]);

        await interaction.reply({ embeds: [helpEmbed], components: [row] });

        const filter = i => i.customId === "category-select-menu" && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on("collect", async i => {
            await i.deferUpdate();

            if (i.values[0] === "general") {
                const generalEmbed = new EmbedBuilder()
                    .setColor(config.colors.information)
                    .setTitle("General Commands")
                    .setDescription("Here are the available commands:\n\n/ping - Bot ping\n/report - Report a user")
                    .setFooter("Bot by your name");
                await interaction.editReply({ embeds: [generalEmbed] });
            }
            else if (i.values[0] === "owner") {
                const ownerEmbed = new EmbedBuilder()
                    .setColor(config.colors.information)
                    .setTitle("Owner Commands")
                    .setDescription("Here are the available commands:\n\n/settings - Change bot settings")
                    .setFooter("Bot by your name");
                await interaction.editReply({ embeds: [ownerEmbed] });
            }
        });

        collector.on("end", async () => {
            const helpEmbed = new EmbedBuilder()
                .setColor(config.colors.information)
                .setTitle("Help")
                .setDescription("The help menu has timed out.")
                .setFooter("Bot by your name");
            await interaction.editReply({ embeds: [helpEmbed], components: [] });
        });
    }
};