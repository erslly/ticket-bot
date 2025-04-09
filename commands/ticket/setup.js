const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createTicketPanel } = require('../../utils/ticketUtils');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Ticket panelini kurarsınız')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName('kanal')
        .setDescription('Paneli göndermek istediğiniz kanal')
        .setRequired(true)),

        async execute(interaction) {
            try {
                const channel = interaction.options.getChannel('kanal');

                if (channel.type !== 0) { 
                    return interaction.reply({
                      content: 'Panel sadece metin kanallarına kurulabilir.',
                      ephemeral: true
                    });
                }

                const { embed, row } = createTicketPanel();

                await channel.send({
                    embeds: [embed],
                    components: [row]
                });

                return interaction.reply({
                    content: `Destek talebi paneli ${channel} kanalına başarıyla kuruldu.`,
                    ephemeral: true
                });
            } catch (error) {
                console.error('Ticket setup hatası:', error)
                return interaction.reply({
                    content: 'Panel kurulurken bir hata oluştu.',
                    ephemeral: true
                });
            }
        }
};