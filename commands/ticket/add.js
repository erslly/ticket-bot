const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const TicketManager = require('../../database/ticketManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-add')
    .setDescription('Destek talebine bir kullanıcı ekler')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Destek talebine eklenecek kullanıcı')
        .setRequired(true)),
  
  async execute(interaction) {
    try {
      const ticket = await TicketManager.findTicketByChannel(interaction.channel.id);
      if (!ticket) {
        return interaction.reply({
          content: 'Bu komut sadece destek talebi kanallarında kullanılabilir.',
          ephemeral: true
        });
      }
      
      const user = interaction.options.getUser('kullanıcı');
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      
      if (!member) {
        return interaction.reply({
          content: 'Belirtilen kullanıcı sunucuda bulunamadı.',
          ephemeral: true
        });
      }
      
      const permissionCheck = interaction.channel.permissionsFor(member);
      if (permissionCheck && permissionCheck.has(PermissionFlagsBits.ViewChannel)) {
        return interaction.reply({
          content: `${user} zaten bu destek talebine erişebiliyor.`,
          ephemeral: true
        });
      }
      
      await interaction.channel.permissionOverwrites.edit(user.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
      });
      
      return interaction.reply({
        content: `${user} kullanıcısı destek talebine eklendi.`
      });
    } catch (error) {
      console.error('Ticket add hatası:', error);
      return interaction.reply({
        content: 'Kullanıcı eklenirken bir hata oluştu.',
        ephemeral: true
      });
    }
  }
};