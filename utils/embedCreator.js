const { EmbedBuilder } = require('discord.js');

class EmbedCreator {
  /**
   * 
   * @param {String} title 
   * @param {String} description 
   * @returns {EmbedBuilder} 
   */
  static success(title, description) {
    return new EmbedBuilder()
      .setTitle(`✅ ${title}`)
      .setDescription(description)
      .setColor('#2ecc71')
      .setTimestamp();
  }
  
  /**
   * 
   * @param {String} title 
   * @param {String} description 
   * @returns {EmbedBuilder} 
   */
  static error(title, description) {
    return new EmbedBuilder()
      .setTitle(`❌ ${title}`)
      .setDescription(description)
      .setColor('#e74c3c')
      .setTimestamp();
  }
  
  /**
   * B
   * @param {String} title 
   * @param {String} description 
   * @returns {EmbedBuilder} 
   */
  static info(title, description) {
    return new EmbedBuilder()
      .setTitle(`ℹ️ ${title}`)
      .setDescription(description)
      .setColor('#3498db')
      .setTimestamp();
  }
  
  /**
   * 
   * @param {String} title 
   * @param {String} description 
   * @returns {EmbedBuilder} 
   */
  static warning(title, description) {
    return new EmbedBuilder()
      .setTitle(`⚠️ ${title}`)
      .setDescription(description)
      .setColor('#f39c12')
      .setTimestamp();
  }
  
  /**
   * 
   * @param {Object} options 
   * @returns {EmbedBuilder} 
   */
  static custom(options) {
    const embed = new EmbedBuilder();
    
    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.color) embed.setColor(options.color);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.author) embed.setAuthor(options.author);
    if (options.footer) embed.setFooter(options.footer);
    if (options.timestamp) embed.setTimestamp();
    if (options.fields) embed.addFields(options.fields);
    
    return embed;
  }
}

module.exports = EmbedCreator;