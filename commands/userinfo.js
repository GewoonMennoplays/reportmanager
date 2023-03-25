const { Permissions, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const config = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Displays user information.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to show information for.")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const roles = member.roles.cache
      .filter((r) => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((r) => r.toString())
      .join(" ") || "None";

    const permissions = member.permissions.toArray().map((p) => `\`${p}\``).join(", ") || "None";

    const joinedAt = moment.utc(member.joinedTimestamp).format("X");
    const createdAt = moment.utc(user.createdTimestamp).format("X");

    const badges = user.flags.toArray().join(", ");
    const activity = member.presence?.activities.length > 0 ? member.presence.activities.map(a => a.name).join(', ') : "None";
    const boosted = member.premiumSinceTimestamp
      ? moment.utc(member.premiumSinceTimestamp).format("X")
      : "Not Boosting";

    const description = `**User ID:** \`${user.id}\`
**Descriminator:** \`${user.discriminator}\`
**Joined Discord:** \`${createdAt}\`
**Joined Server:** \`${joinedAt}\`
**Activity:** \`${activity}\`
**Badges:** \`${badges}\`
**Permissions:** ${permissions}`;

    const embed = new EmbedBuilder()
      .setColor(config.colors.default)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setTitle(`${user.username}#${user.discriminator}`)
      .setDescription(description);

    await interaction.reply({ embeds: [embed] });
  },
};
