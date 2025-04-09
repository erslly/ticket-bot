const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits, PermissionOverwrites } = require('discord.js')
const config = require('../config.json');
const TicketManager = require('../database/ticketManager')

/**
 * 
 * @returns {Object} 
 */

function createTicketPanel() {
    const embed = new EmbedBuilder()
    .setTitle('🎫 Destek Sistemi')
    .setDescription('Aşağıdaki seçeneklerden uygun olanı seçerek hemen bir ticket oluşturabilirsiniz.')
    .setColor('#2F3136')
    .addFields(
        { name: '📝 Sunucu Bilgisi:', value: 'Sunucumuzun kurallarını okumayı unutmayın.'}
    )
    .setFooter({ text: 'Destek talepleri ekibimiz tarafından en kısa sürede yanıtlanacaktır.'});

    const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('ticket_category_select')
    .setPlaceholder('Ticket açmak için kategori seçiniz')
    .addOptions(
        config.ticketCategories.map(category => {
            return new StringSelectMenuOptionBuilder()
            .setLabel(category.name)
            .setDescription(category.description)
            .setValue(category.value)
            .setEmoji(category.emoji)
        })
    );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    return { embed, row};
}

/**
 * 
 * @param {Interaction} interaction 
 * @param {String} categoryType 
 */
async function createTicket(interaction, categoryType) {
    try {
        const existingTicket = await TicketManager.findTicketByUser(interaction.user.id);   
        if(existingTicket) {
            return interaction.reply({
                content: `Zaten açık bir destek talebiniz var: <#${existingTicket.channelId}>`,
                ephemeral: true
            });
        }

        const categoryInfo = config.ticketCategories.find(cat => cat.value === categoryType);
        if(!categoryInfo) {
            return interaction.reply({
                content: 'Geçersiz ticket kategorisi',
                ephemeral: true
            });
        }

        const guild = interaction.guild;

        const channelName = `ticket-${interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;

        const ticketChannel = await guild.channels.create({
            name: channelName,
            type: 0,
            parent: categoryInfo.categoryId,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id, 
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                },
                {
                    id: config.staffRoleId, 
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                }
            ]
        });

        await TicketManager.createTicket({
            guildId: guild.id,
            channelId: ticketChannel.id,
            userId: interaction.user.id,
            categoryType: categoryType,
            createdAt: new Date(),
            status: 'open'
        });

        const ticketEmbed = new EmbedBuilder()
        .setTitle(`${categoryInfo.emoji} ${categoryInfo.name} Destek Talebi`)
        .setDescription(`Merhaba <@${interaction.user.id}>,\n\nDestek ekibimiz en kısa sürede size yardımcı olacaktır. Lütfen sorununuzu detaylı bir şekilde açıklayın.`)
        .setColor(categoryInfo.color)
        .setTimestamp();

        const ticketButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('Talebi Kapat')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒'),
            new ButtonBuilder()
            .setCustomId('ticket_claim')
            .setLabel('Talebi Üstlen')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✋')
        );

        await ticketChannel.send({
            content: `<@${interaction.user.id}> | <@&${config.staffRoleId}>`,
            embeds: [ticketEmbed],
            components: [ticketButtons]
        });

        return interaction.reply({
            content: `Destek talebiniz oluşturuldu: <#${ticketChannel.id}>`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Ticket oluşturma hatası:', error);
        return interaction.reply({
            content: 'Ticket oluşturulurken bir hata oluştu.',
            ephemeral: true
        });
    }  
}

/**
 * 
 * @param {Interaction} interaction 
*/
async function closeTicket(interaction) {
    try {
        const ticket = await TicketManager.findTicketByChannel(interaction.channel.id);
        if(!ticket) {
            return interaction.reply({
                content: 'Bu kanal bir destek talebi değil.',
                ephemeral: true
            });
        }

        await TicketManager.updateTicketStatus(ticket._id, 'closed');

        await interaction.channel.permissionOverwrites.edit(ticket.userId, {
            ViewChannel: false
        });

        const reopenButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('ticket_reopen')
            .setLabel('Talebi Yeniden Aç')
            .setStyle(ButtonStyle.Success)
            .setEmoji('🔓')
        );

        const closeEmbed = new EmbedBuilder()
        .setTitle('Talep Kapatıldı')
        .setDescription(`Bu destek talebi <@${interaction.user.id}> tarafından kapatıldı.`)
        .setColor('Red')
        .setTimestamp();

        await interaction.reply({
            embeds: [closeEmbed],
            components: [reopenButton]
        });

        const logChannel = interaction.guild.channels.cache.get(config.ticketLogChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
            .setTitle('Talep Kapatıldı')
            .setDescription(`
                **Talep ID:** ${ticket._id}
                **Kanal:** <#${ticket.channelId}>
                **Kategori:** ${ticket.categoryType}
                **Açan:** <@${ticket.userId}>
                **Kapatan:** <@${interaction.user.id}>
                **Açılış:** <t:${Math.floor(ticket.createdAt.getTime() / 1000)}:F>
                **Kapanış:** <t:${Math.floor(Date.now() / 1000)}:F>
            `)
            .setColor('Red')
            .setTimestamp();

            await logChannel.send({ embeds: [logEmbed]});
        }
    } catch (error) {
        console.error('Ticket kapatma hatası:', error);
        return interaction.reply({
            content: 'Talep kapatılırken bir hata oluştu',
            ephemeral: true
        });
    }
}

/**
 * 
 * @param {Interaction} interaction 
*/
async function reopenTicket(interaction) {
    try {
        const ticket = await TicketManager.findTicketByChannel(interaction.channel.id);
        if (!ticket) {
            return interaction.reply({
                content: 'Bu kanal bir destek talebi değil.',
                ephemeral: true
            });
        }

        await TicketManager.updateTicketStatus(ticket._id, 'open');

        await interaction.channel.permissionOverwrites.edit(ticket.userId, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });

        const ticketButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('Talebi Kapat')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒'),
          new ButtonBuilder()
            .setCustomId('ticket_claim')
            .setLabel('Talebi Üstlen')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✋')
        );
        
        const reopenEmbed = new EmbedBuilder()
        .setTitle('Talep Yeniden Açıldı')
        .setDescription(`Bu destek talebi <@${interaction.user.id}> tarafından yeniden açıldı.`)
        .setColor('Green')
        .setTimestamp();

        await interaction.reply({
            embeds: [reopenEmbed],
            components: [ticketButtons]
        });
    } catch (error) {
        console.error('Ticket yeniden açma hatası:', error)
        return interaction.reply({
            content: 'Talep yeniden açılırken bir hata oluştu',
            ephemeral: true
        });
    }
}

/**
 * 
 * @param {Interaction} interaction 
*/
async function deleteTicket(interaction) {
    try {
        const ticket = await TicketManager.findTicketByChannel(interaction.channel.id);
        if (!ticket) {
            return interaction.reply({
                content: 'Bu kanal bir destek talebi değil.',
                ephemeral: true
            });
        }

        const deleteEmbed = new EmbedBuilder()
        .setTitle('Talep Siliniyor')
        .setDescription('Bu destek talebi 5 saniye içinde silinecek...')
        .setColor('Red')
        .setTimestamp();

        await interaction.reply({ embeds: [deleteEmbed] });

        const logChannel = interaction.guild.channels.cache.get(config.ticketLogChannelId);
        if (logChannel) {
          const logEmbed = new EmbedBuilder()
            .setTitle('Talep Silindi')
            .setDescription(`
              **Talep ID:** ${ticket._id}
              **Kanal:** ${interaction.channel.name}
              **Kategori:** ${ticket.categoryType}
              **Açan:** <@${ticket.userId}>
              **Silen:** <@${interaction.user.id}>
              **Açılış:** <t:${Math.floor(ticket.createdAt.getTime() / 1000)}:F>
              **Silinme:** <t:${Math.floor(Date.now() / 1000)}:F>
            `)
            .setColor('DarkRed')
            .setTimestamp();

            await logChannel.send({ embeds: [logEmbed] });
    }

    await TicketManager.deleteTicket(ticket._id);

    setTimeout(async () => {
        await interaction.channel.delete();
      }, 5000);
    } catch (error) {
      console.error('Ticket silme hatası:', error);
      return interaction.reply({
        content: 'Talep silinirken bir hata oluştu.',
        ephemeral: true
      });
    }
}

/**
 * 
 * @param {Interaction} interaction 
*/
async function claimTicket(interaction) {
    try {
        const ticket = await TicketManager.findTicketByChannel(interaction.channel.id);
        if (!ticket) {
            return interaction.reply({
                content: 'Bu kanal bir destek talebi değil.',
                ephemeral: true
            });
        }

        if (ticket.claimedBy) {
            return interaction.reply({
                content: `Bu destek talebi zaten <@${ticket.claimedBy}> tarafından üstlenilmiş.`,
                ephemeral: true
            });
        }

        await TicketManager.updateTicketClaim(ticket._id, interaction.user.id);

        const claimEmbed = new EmbedBuilder()
        .setTitle('Talep Üstlenildi')
        .setDescription(`Bu destek talebi <@${interaction.user.id}> tarafından üstlenildi.`)
        .setColor('Blue')
        .setTimestamp();

        await interaction.reply({ embeds: [claimEmbed] });
    } catch (error) {
        console.error('Ticket üstlenme hatası:', error)
        return interaction.reply({
            content: 'Talep üstlenilirken bir hata oluştu.',
            ephemeral: true
        });
    }
}

module.exports = {createTicketPanel, createTicket, closeTicket, reopenTicket, deleteTicket, claimTicket};