module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
      console.log(`✅ Bot başarıyla giriş yaptı: ${client.user.tag}`);
      
      client.user.setPresence({
        activities: [{ name: 'Developed by erslly', type: 2 }],
        status: 'online'
      });
    }
  };