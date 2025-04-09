const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const TicketManager = require('../../database/ticketManager');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-stats')
    .setDescription('Destek talebi istatistiklerini gösterir')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  
  async execute(interaction) {
    try {
      await interaction.deferReply();
      
      const stats = await TicketManager.getStats(interaction.guild.id);
      
      const categoryInfo = stats.categories.map(cat => {
        const categoryData = config.ticketCategories.find(c => c.value === cat._id) || { name: cat._id };
        return `**${categoryData.name}:** ${cat.count}`;
      }).join('\n');
      
      const statsEmbed = new EmbedBuilder()
        .setTitle('📊 Destek Talebi İstatistikleri')
        .setColor('#3498db')
        .setDescription(`
          **Toplam Talep:** ${stats.total}
          **Açık Talepler:** ${stats.open}
          **Kapalı Talepler:** ${stats.closed}
          
          **Son 7 Günde Açılan:** ${stats.lastWeekCount}
          
          **Kategorilere Göre:**
          ${categoryInfo}
        `)
        .setFooter({ text: `${interaction.guild.name} | ${new Date().toLocaleDateString()}` })
        .setTimestamp();
      
      return interaction.editReply({ embeds: [statsEmbed] });
    } catch (error) {
      console.error('Ticket stats hatası:', error);
      return interaction.editReply({
        content: 'İstatistikler alınırken bir hata oluştu.'
      });
    }
  }
};