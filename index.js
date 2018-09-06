//Dependencies
const Discord = require('discord.js');
const rest = require('node-rest-client').Client;
const config = require("./config.json");
const Datastore = require('nedb');

//setup
const client = new Discord.Client();
const db = new Datastore({
  filename: 'data/datafile',
  autoload: true
});
const restcall = new rest();

//start bot
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Battle of Wits', {
      type: 'PLAYING'
    })
    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
    .catch(console.error);
});

//new user join
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

//command handler
client.on('message', msg => {
  console.log("Channel: "msg.channel.name + ", Sender: " + msg.author.username + ", Message: " msg.msg.content);
  if (msg.channel.id != config.botchannel) {
    return;
  };

  if (msg.content.substring(0, 1) == config.prefix) {
    let args = msg.content.substring(1).split(' ');
    let cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      /*case 'gettradeuser':
        let userID = msg.author.id;
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
      case 'settradeuser':
        if (args[0] == null) {
          msg.reply("Please Specify a username");
          break;
        } else {
          let userID = msg.author.id;
          let userN = args.join(' ');
          db.remove({
            userID: userID
          }, {
            multi: true
          }, function(err, numRemoved) {});
          let doc = {
            userID: userID,
            userN: userN
          };
          db.insert(doc, function(err, newDoc) {
            msg.reply("Username set to: " + userN);
          });
        }
        break;
      case 'tradelist':
        if (args[0] == null) {
          msg.reply("Please Specify a user");
          break;
        } else {
          let username = args.join(' ').substring(2,(args.join(' ').length - 1));
          msg.guild.fetchMember(username)
          .then(member => {
            db.find({
              userID: member.id
            }, function(err, docs) {
              if (docs[0] != null) {
                let user = docs[0].userN;
                restcall.get(("https://deckbox-api.herokuapp.com/api/users/" + user), function (data, response) {
                  let sets = data.sets;
                  console.log(sets);
                  let tradelist = 0;
                  sets.forEach(function(item, index, array) {
                    if(item.name == 'tradelist'){
                      tradelist = item.id;
                    }
                  });
                  console.log(tradelist);
                  msg.reply('https://deckbox.org/sets/' + tradelist);
                });
              } else {
                msg.reply("They have not set a username");
              }
            });
          });


        }
        break;
        case 'wishlist':
          if (args[0] == null) {
            msg.reply("Please Specify a user");
            break;
          } else {
            let username = args.join(' ').substring(2,(args.join(' ').length - 1));
            msg.guild.fetchMember(username)
            .then(member => {
              db.find({
                userID: member.id
              }, function(err, docs) {
                if (docs[0] != null) {
                  let user = docs[0].userN;
                  restcall.get(("https://deckbox-api.herokuapp.com/api/users/" + user), function (data, response) {
                    let sets = data.sets;
                    console.log(sets);
                    let wishlist = 0;
                    sets.forEach(function(item, index, array) {
                      if(item.name == 'wishlist'){
                        wishlist = item.id;
                      }
                    });
                    console.log(wishlist);
                    msg.reply('https://deckbox.org/sets/' + wishlist);
                  });
                } else {
                  msg.reply("They have not set a username");
                }
              });
            });


          }
          break;
      case 'setNick':
        if (args[0] == null) {
          msg.reply("Please Specify a Nickname");
          break;
        }
        let nick = args.join(' ');
        msg.member.setNickname(nick)
          .then(function(value) {
            msg.reply("Nickname set to " + nick);
          })
          .catch(function(error) {
            if (error.message === "Missing Permissions") {
              msg.channel.send("Your Role is too high for the bot to set you Nick please do it youself.");
            } else {
              msg.reply("Could not add role");
            }
          });
      break;*/
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
              msg.reply("Hey everyone, " + msg.author + " just tried to do something silly!");
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
        msg.guild.fetchMember(config.botid)
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
      case 'purge':
        if (msg.author.id == '168776730541031424') {
          if (msg.channel.type == 'text') {
            msg.channel.fetchMessages()
              .then(messages => {
                msg.channel.bulkDelete(messages,true);
                messagesDeleted = messages.array().length; // number of messages deleted
                //msg.channel.sendMessage("Deletion of messages successful. Total messages deleted: " + messagesDeleted);
                console.log('Deletion of messages successful. Total messages deleted: ' + messagesDeleted)
              })
              .catch(err => {
                console.log('Error while doing Bulk Delete');
                console.log(err);
              });
          }
        }
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

//login
client.login(config.token);
