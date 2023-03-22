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

    const badges = user.flags.toArray();
    const activity = member.presence?.activities[0] || "None";
    const boosted = member.premiumSinceTimestamp
      ? moment.utc(member.premiumSinceTimestamp).format("X")
      : "Not Boosting";

    const embed = new EmbedBuilder()
      .setColor(config.colors.default)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setTitle(`${user.username}#${user.discriminator}`)
      .addFields(
        { name: "User ID", value: user.id, inline: true },
        { name: "Descriminator", value: user.discriminator, inline: true},
        { name: "Joined Discord", value: createdAt, inline: true},
        { name: "Joined Server", value: joinedAt, inline: true},
        { name: "Roles", value: roles, inline: true},
        { name: "Activity", value: activity, inline: true},
        { name: "Roles", value: boosted, inline: true},
        { name: "Badges", value: badges, inline: false},
        { name: "Permissions", value: permissions, inline: false},
    )

    await interaction.reply({ embeds: [embed] });
  },
};