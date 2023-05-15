const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

const {
  Client,
  Partials,
  Collection,
  GatewayIntentBits,
} = require("discord.js");
const config = require("./config/config");

app.use(
  cors({
    origin: [
      config.FrontURL.LOCALHOST,
      config.FrontURL.OLD,
      config.FrontURL.URL,
      config.FrontURL.MODULE_5,
    ],
  })
);

app.use(errorHandler);

// Creating a new client:
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
  presence: {
    activities: [
      {
        name: "The Suinami is coming!",
        type: 0,
      },
    ],
    status: "dnd",
  },
});

const port = process.env.PORT || 3001;

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.get("/api/getuser", (req, res) => {
  client.guilds.cache.forEach((guild) => {
    console.log(`${guild.name} | ${guild.memberCount} | ${guild.id}`);
  });
  res.write("<h1>about us page<h1>"); //write a response
  res.end(); //end the response
});

app.post("/api/set_roles", (req, res, next) => {
  let buffer, dataRole;
  req.on("data", (chunk) => {
    buffer += chunk;
  });

  req.on("end", () => {
    dataRole = parse_string(buffer);
    // console.log(parse_string(buffer));

    //add role
    const addRole = async (guildId, roleId, userId) => {
      // console.log(guildId, roleId, userId)
      if (!guildId) return;
      if (!roleId) return;
      if (!userId) return;
      try {
        const guild = client.guilds.cache.get(guildId); // copy the id of the server your bot is in and paste it in place of guild-ID.
        const role = guild.roles.cache.get(roleId); // here we are getting the role object using the id of that role.
        const user = await client.users.fetch(userId);
        const member = await guild.members.fetch(user);
        // console.log(role, user, member)
        member.roles.add(role);
        // console.log(member.roles.add(role));
        if (!role || !member) {
          // do something if either member or role not available
          res.send(
            JSON.stringify({
              status: "404",
            })
          );
        } else {
          res.send(
            JSON.stringify({
              status: "200",
            })
          );
        }
      } catch (error) {
        res.send(error);
      }
    };

    addRole(dataRole.guild_id, dataRole.role_id, dataRole.user_id);
  });
});

app.post("/api/dell_roles", (req, res) => {
  let buffer, dataRole;
  req.on("data", (chunk) => {
    buffer += chunk;
  });
  req.on("end", () => {
    dataRole = parse_string(buffer);

    const removeRole = async (guildId, roleId, userId) => {
      try {
        const guild = client.guilds.cache.get(guildId);
        const role = guild.roles.cache.get(roleId);
        const user = await client.users.fetch(userId);
        const member = await guild.members.fetch(user);
        console.log(member.roles.remove(role));
        res.send(
          JSON.stringify({
            status: "200",
          })
        );
      } catch (error) {
        res.send(error);
      }
    };

    removeRole(dataRole.guild_id, dataRole.role_id, dataRole.user_id);

    //GET USER BY USER NAME
    // const guild = client.guilds.cache.get(dataRole.guild_id);
    // let myUser = client.users.cache.find(user => user.username == dataRole.user_name);
    // console.log(myUser)

    //GET ROLE BY ROLE NAME
    // let myRole = guild.roles.cache.find(role => role.name === dataRole.role_name);
    // console.log(myRole)
  });
});

app.post("/api/checkroleuser", (req, res) => {
  let buffer, dataRole;
  req.on("data", (chunk) => {
    buffer += chunk;
  });
  req.on("end", () => {
    dataRole = parse_string(buffer);
    console.log(parse_string(buffer));
    const guild = client.guilds.cache.get(dataRole.guild_id);
    console.log(guild);
    $membs = guild.roles.cache
      .get(dataRole.role_id)
      .members.map((m) => m.user.username);
    console.log($membs);
    res.end(
      JSON.stringify({
        data: $membs,
      })
    );
  });
});

app.post("/api/has_role", async (req, res) => {
  let buffer, dataRole;
  req.on("data", (chunk) => {
    buffer += chunk;
  });
  req.on("end", () => {
    dataRole = parse_string(buffer);
    const hasRole = async (guild_id, role_id, user_id) => {
      try {
        const guild = await client.guilds.fetch(guild_id);
        if (!guild) throw new Error("Server not found");
        const member = await guild.members.fetch({ user: user_id });
        if (!member) throw new Error("Member not found");
        const roles = member.roles.cache.map((r) => r.id);
        const eligibleRoles = roles.filter((r) => r.includes(role_id));
        let result;
        if (eligibleRoles.length === 0) {
          result = false;
        } else {
          result = eligibleRoles;
        }
        res.send(
          JSON.stringify({
            data: result,
          })
        );
      } catch (error) {
        res.send(error);
      }
    };

    hasRole(dataRole.guild_id, dataRole.role_id, dataRole.user_id);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const AuthenticationToken = process.env.TOKEN || config.Client.TOKEN;
if (!AuthenticationToken) {
  console.warn(
    "[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js."
      .red
  );
  return process.exit();
}

// Handler:
client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "application_commands", "modals", "events", "mongoose"].forEach(
  (file) => {
    require(`./handlers/${file}`)(client, config);
  }
);

// Login to the bot:
client.login(AuthenticationToken).catch((err) => {
  console.error("[CRASH] Something went wrong while connecting to your bot...");
  console.error("[CRASH] Error from Discord API:" + err);
  return process.exit();
});

// Handle errors:
process.on("unhandledRejection", async (err, promise) => {
  console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
  console.error(promise);
});

function parse_string(str) {
  str = str.replace(/\s/g, "");
  str = str.slice(10, 500);

  dataRole = JSON.parse("{" + str);
  return JSON.parse("{" + str);
}
