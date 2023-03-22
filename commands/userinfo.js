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

    const embed = new EmbedBuilder()
      .setColor(config.colors.default)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setTitle(`${user.username}#${user.discriminator}`)
      .addFields(
        { name: "User ID", value: user.id, inline: true },
        { name: "Descriminator", value: user.discriminator, inline: true},
        { name: "Joined Discord", value: moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a"), inline: true},
        { name: "Joined Server", value: moment(member.joinedAt).format("MMMM Do YYYY, h:mm:ss a"), inline: true},
        { name: "Roles", value: roles, inline: true},
        { name: "Permissions", value: permissions, inline: true},
    )
    if (user.presence?.activities?.length > 0) {
      const activities = user.presence.activities.map((a) => `${a.name} ${a.details ? `(${a.details})` : ""}`).join("\n");
      embed.addFields({ name: "Activities", value: activities });
    }

    if (user.flags?.toArray().length > 0) {
      const flags = user.flags.toArray().map((f) => `\`${f}\``).join(", ");
      embed.addFields({ name: "Badges", values: flags, inline: true });
    }

    if (member.premiumSince) {
      const boostedSince = moment(member.premiumSince).format("MMMM Do YYYY, h:mm:ss a");
      embed.addFields({ name: "Boosted Since", values: boostedSince, inline: true});
    }

    await interaction.reply({ embeds: [embed] });
  },
};