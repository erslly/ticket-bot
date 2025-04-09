const { createTicket, closeTicket, reopenTicket, deleteTicket, claimTicket } = require('../utils/ticketUtils');
  
  module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
      try {
        if (interaction.isChatInputCommand()) {
          const command = client.commands.get(interaction.commandName);
          
          if (!command) return;
          
          try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Komut hatası: ${interaction.commandName}`);
            console.error(error);
            
            const errorMessage = {
              content: 'Bu komutu çalıştırırken bir hata oluştu.',
              ephemeral: true
            };
            
            if (interaction.replied || interaction.deferred) {
              await interaction.followUp(errorMessage);
            } else {
              await interaction.reply(errorMessage);
            }
          }
        }
        
        else if (interaction.isStringSelectMenu()) {
          if (interaction.customId === 'ticket_category_select') {
            const categoryType = interaction.values[0];
            
            if (categoryType === 'reset_options') {
              await interaction.update({
                content: 'Seçenekler sıfırlandı. Yeni bir kategori seçebilirsiniz.',
                components: [interaction.message.components[0]],
                ephemeral: true
            });
              return;
            }
            
            await createTicket(interaction, categoryType);
          }
        }
        
        else if (interaction.isButton()) {
          const { customId } = interaction;
          
          if (customId === 'ticket_close') {
            await closeTicket(interaction);
        }
          
          else if (customId === 'ticket_reopen') {
            await reopenTicket(interaction);
        }
          
          else if (customId === 'ticket_delete') {
            await deleteTicket(interaction);
        }
          
          else if (customId === 'ticket_claim') {
            await claimTicket(interaction);
          }
        }
    } catch (error) {
        console.error('Etkileşim işleme hatası:', error);
    }
    }
};