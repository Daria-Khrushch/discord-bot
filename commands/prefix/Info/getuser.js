const { EmbedBuilder } = require("discord.js"); 

module.exports = {
  config: {
    name: "getuser",
    description: "Replies with pong!",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {
    //client.guilds.cache.get('id')
   //let nameList= client.guilds.cache.get('1065778856998482012').members.map(m=>m.user.tag);
    //console.log(client.guilds.cache.size());
    client.guilds.cache.forEach( (guild) => {
      console.log(`${guild.name} | ${guild.memberCount} | ${guild.id}`)
      })
      console.log('1');
      
      
                             //  let list = client.guilds.cache.get("1054833212603510785");
          //console.log(list);
          //  try {
            //   await list.members.fetch();
    
                         //     let role1 = list.roles.cache.get('1065778856998482012').members.map(m => m.user.id);
                           //   console.log(role1);
            // } catch (err) {
            //    console.error(err);
            // }
   ///////////////////////////////////
            // let roleID = "1065778856998482012";
            // let membersWithRole = client.guild.roles.cache.get(roleID).members;
            // console.log(`Got ${membersWithRole.size} members with that role.`);

            // const member = await message.guild.members.fetch('1054833212603510785');
            // console.log(member);
           const guild =  client.guilds.cache.get('1054833212603510785');
            console.log(guild);

           $membs =  guild.roles.cache.get('1065914328580104203').members.map(m => m.user.id);
           console.log($membs);
           console.log('11');
           $membs1 =  guild.roles.cache.get('1065914328580104203').members.map(m => m.user.username);
           console.log($membs1);
            // First use guild.members.fetch to make sure all members are cached
guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
  console.log('test1');
	const totalOnline = fetchedMembers.filter(member => member.presence?.status === 'online');
	// Now you have a collection with all online member objects in the totalOnline variable
  console.log(`There are currently ${fetchedMembers} members online in this guild!`);
	//console.log(`There are currently ${totalOnline.size} members online in this guild!`);
});
   // console.log(nameList);
    message.reply({ embeds: [
      new EmbedBuilder()
        .setDescription(`🏓 **Pong!** Client websocket ping: \`${client.ws.ping}\` ms1.`)
        .setColor("Green")
    ] })
    
  },
};
