const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  channelId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  categoryType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'deleted'],
    default: 'open'
  },
  claimedBy: {
    type: String,
    default: null
  },
  transcript: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  closedAt: {
    type: Date,
    default: null
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

class TicketManager {
  /**
   * 
   * @param {Object} ticketData 
   * @returns {Promise<Object>} 
   */
  static async createTicket(ticketData) {
    try {
      const ticket = new Ticket(ticketData);
      await ticket.save();
      return ticket;
    } catch (error) {
      console.error('Ticket oluşturma DB hatası:', error);
      throw error;
    }
  }
  
  /**
   * 
   * @param {String} userId 
   * @returns {Promise<Object|null>} 
   */
  static async findTicketByUser(userId) {
    try {
      return await Ticket.findOne({ 
        userId: userId,
        status: 'open'
      });
    } catch (error) {
      console.error('Ticket arama DB hatası:', error);
      throw error;
    }
  }
  
  /**
   * 
   * @param {String} channelId 
   * @returns {Promise<Object|null>} 
   */
  static async findTicketByChannel(channelId) {
    try {
      return await Ticket.findOne({ channelId: channelId });
    } catch (error) {
      console.error('Ticket arama DB hatası:', error);
      throw error;
    }
  }
  
  /**
   * 
   * @param {String} ticketId 
   * @param {String} status 
   * @returns {Promise<Object>} 
   */
  static async updateTicketStatus(ticketId, status) {
    try {
      const updateData = { status };
      
      if (status === 'closed') {
        updateData.closedAt = new Date();
      }
      
      return await Ticket.findByIdAndUpdate(
        ticketId,
        updateData,
        { new: true }
      );
    } catch (error) {
      console.error('Ticket güncelleme DB hatası:', error);
      throw error;
    }
  }
  
  /**
   * 
   * @param {String} ticketId 
   * @param {String} transcript 
   * @returns {Promise<Object>} 
   */
  static async updateTicketTranscript(ticketId, transcript) {
    try {
      return await Ticket.findByIdAndUpdate(
        ticketId,
        { transcript },
        { new: true }
      );
    } catch (error) {
      console.error('Transcript güncelleme DB hatası:', error);
      throw error;
    }
  }
  
  /**
   * 
   * @param {String} ticketId -
   * @param {String} userId 
   * @returns {Promise<Object>} 
   */
  static async updateTicketClaim(ticketId, userId) {
    try {
      return await Ticket.findByIdAndUpdate(
        ticketId,
        { claimedBy: userId },
        { new: true }
      );
    } catch (error) {
      console.error('Ticket üstlenme DB hatası:', error);
      throw error;
    }
  }
  
  /**
   * 
   * @param {String} ticketId 
   * @returns {Promise<Object>} 
   */
  static async deleteTicket(ticketId) {
    try {
      return await Ticket.findByIdAndDelete(ticketId);
    } catch (error) {
      console.error('Ticket silme DB hatası:', error);
      throw error;
    }
  }
  
  /**
   * 
   * @param {String} guildId 
   * @returns {Promise<Array>} 
   */
  static async getAllTickets(guildId) {
    try {
      return await Ticket.find({ guildId });
    } catch (error) {
      console.error('Ticket listeleme DB hatası:', error);
      throw error;
    }
  }
  
  /**
   * 
   * @param {String} guildId 
   * @returns {Promise<Object>} 
   */
  static async getStats(guildId) {
    try {
      const total = await Ticket.countDocuments({ guildId });
      const open = await Ticket.countDocuments({ guildId, status: 'open' });
      const closed = await Ticket.countDocuments({ guildId, status: 'closed' });
      
      const categoryCounts = await Ticket.aggregate([
        { $match: { guildId } },
        { $group: { _id: '$categoryType', count: { $sum: 1 } } }
      ]);
      
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const lastWeekCount = await Ticket.countDocuments({
        guildId,
        createdAt: { $gte: lastWeek }
      });
      
      return {
        total,
        open,
        closed,
        categories: categoryCounts,
        lastWeekCount
      };
    } catch (error) {
      console.error('İstatistik alma DB hatası:', error);
      throw error;
    }
  }
}

module.exports = TicketManager;