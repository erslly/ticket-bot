const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { closeTicket } = require('../../utils/ticketUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-close')
    .setDescription('Destek talebini kapatır')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Kapatma sebebi')
        .setRequired(false)),
  
  async execute(interaction) {
    try {
      await closeTicket(interaction);
    } catch (error) {
      console.error('Ticket close hatası:', error);
      return interaction.reply({
        content: 'Talep kapatılırken bir hata oluştu.',
        ephemeral: true
      });
    }
  }
};