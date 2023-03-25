const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('Deploys the slash commands to Discord'),

  async execute(interaction) {
    // Check if the user ID matches the devID in the config
    if (interaction.user.id !== config.general.devID) {
        await interaction.reply({
          content: 'You are not authorized to use this command!',
          ephemeral: true // Make the response visible only to the user who triggered the command
        });
        return;
      }
    
    await interaction.deferReply();

    try {
      await require('./deploy-commands');
      const succesEmbed = new EmbedBuilder()
      .setTitle("Admin - Developer Panel")
      .setDescription("✅ ``Deployed the slash commands to Discord succesfully!``")
      .setColor("#FF0000")
      await interaction.editReply({embeds: [succesEmbed], ephemeral: true});
    } catch (error) {
      console.error(error);
      const failEmbed = new EmbedBuilder()
      .setTitle("Admin - Developer Panel")
      .setDescription(":x: ``Failed top deploy the slash commands to Discord:``\n ```" + error + "```")
      .setColor("#FF0000")
      await interaction.editReply({embeds: [failEmbed], ephemeral: true});
    }
  },
};
