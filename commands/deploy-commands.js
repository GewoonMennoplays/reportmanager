const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('Deploys the slash commands to Discord'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      await require('./deploy-commands');
      await interaction.editReply('Deployed the slash commands to Discord!');
    } catch (error) {
      console.error(error);
      await interaction.editReply('Failed to deploy the slash commands to Discord.');
    }
  },
};
