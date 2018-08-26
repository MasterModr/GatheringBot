const Discord = require('discord.js');
const client = new Discord.Client();
const restcall = require('node-rest-client').Client;
const config = require("./config.json");
const Datastore = require('nedb'),
  db = new Datastore({
    filename: 'data/datafile',
    autoload: true
  });

client.user.setActivity('YouTube', {
    type: 'WATCHING'
  })
  .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
  .catch(console.error);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

});
client.on('guildMemberAdd', member => {
  console.log(member.id);
  member.createDM().then(chan => {
    let hello = "Welcome to The Gathering's Discord server!\n" +
      "\n" +
      "I'm a bot! I have some commands:\n" +
      "\n" +
      "!addrole [format] : Adds you to a format role\n" +
      "\n" +
      "!removerole [format] : Removes you from a format role\n" +
      "\n" +
      "!getroles : Lists the roles you have added\n" +
      "\n" +
      "!listroles : Lists the server's avalable roles\n" +
      "\n" +
      "In this server, roles are used for groups who play certain Magic formats like Standard, Modern, or EDH.";
    chan.send(hello);
  });
});

client.on('message', msg => {

  if (msg.channel.id != "483096899726082053") {
    console.log("false");
    return;
  };
  console.log(msg.content);
  if (msg.content.substring(0, 1) == config.prefix) {
    var args = msg.content.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      case 'getuser':
        var userID = msg.author.id;
        db.find({
          userID: userID
        }, function(err, docs) {
          if (docs[0] != null) {
            msg.reply(docs[0].userN);
          } else {
            msg.reply("No username defined");
          }
        });

        break;
      case 'setuser':
        if (args[0] == null) {
          msg.reply("Please Specify a username");
          break;
        } else {
          var userID = msg.author.id;
          db.remove({
            userID: userID
          }, {
            multi: true
          }, function(err, numRemoved) {});
          var doc = {
            userID: userID,
            userN: args[0]
          };
          db.insert(doc, function(err, newDoc) {
            msg.reply("Username set to: " + args[0]);
          });
        }
        break;
      case 'addrole':
        if (args[0] == null) {
          msg.reply("Please Specify a role");
          break;
        }
        let role = msg.guild.roles.find(val => val.name.toLowerCase() == args.join(' ').toLowerCase());
        let member = msg.member;
        member.addRole(role)
          .then(function(value) {
            msg.reply("Role " + role.name + " added.");
          })
          .catch(function(error) {
            if (error.message === "Missing Permissions") {
              msg.channel.send("Hey everyone, " + msg.author + " just tried to do something silly!");
            } else {
              msg.reply("Could not add role");
            }
          });
        break;
      case 'removerole':
        if (args[0] == null) {
          msg.reply("Please Specify a role");
          break;
        }
        let role1 = msg.guild.roles.find(val => val.name.toLowerCase() == args.join(' ').toLowerCase());
        let member1 = msg.member;
        member1.removeRole(role1)
          .then(function(value) {
            msg.reply("Role " + role1.name + " removed.");
          })
          .catch(function(error) {
            console.log(error);
            if (error.message === "Missing Permissions") {
              msg.channel.send("Hey everyone, " + msg.author + " just tried to do something silly!");
            } else {
              msg.reply("Could not remove role");
            }
          });
        break;
      case 'getroles':
        let roles = msg.member.roles.array();
        let list = "Your Roles are: ";
        roles.forEach(function(item, index, array) {
          if (item.name != "@everyone") {
            list = list + item.name + "  ";
          }
        });
        msg.reply(list);
        break;
      case 'listroles':
        msg.guild.fetchMember("481853659898970114")
          .then(member => {
            let botrole = member.highestRole.calculatedPosition;
            let roles = msg.guild.roles.array();
            let list = "The available Roles are: ";
            roles.forEach(function(item, index, array) {
              if ((botrole) > item.calculatedPosition) {
                if (item.name != "@everyone") {
                  list = list + item.name + "  ";
                }
              }
            });
            msg.reply(list);
          });
        break;
      case 'help':
        let help = "\nI'm a bot! I have some commands:\n" +
          "\n" +
          "!addrole [format] : Adds you to a format role\n" +
          "\n" +
          "!removerole [format] : Removes you from a format role\n" +
          "\n" +
          "!getroles : Lists the roles you have added\n" +
          "\n" +
          "!listroles : Lists the server's available roles\n" +
          "\n";
        msg.reply(help);
        break;
      default:
        msg.delete();
        break;
    }
  } else {
    if (msg.author.username != "The Grand Calcutron") {
      msg.delete();
    }
  }
});

client.login(config.token);
