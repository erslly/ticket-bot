const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const TicketManager = require('../../database/ticketManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-remove')
    .setDescription('Destek talebinden bir kullanıcıyı çıkarır')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Destek talebinden çıkarılacak kullanıcı')
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
      
      if (user.id === ticket.userId) {
        return interaction.reply({
          content: 'Destek talebini açan kişiyi çıkaramazsınız.',
          ephemeral: true
        });
      }
      
      await interaction.channel.permissionOverwrites.edit(user.id, {
        ViewChannel: false
      });
      
      return interaction.reply({
        content: `${user} kullanıcısı destek talebinden çıkarıldı.`
      });
    } catch (error) {
      console.error('Ticket remove hatası:', error);
      return interaction.reply({
        content: 'Kullanıcı çıkarılırken bir hata oluştu.',
        ephemeral: true
      });
    }
  }
};