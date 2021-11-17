const { COMMANDS } = require('../../util/HELP');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')

module.exports.run = async (bot, message, args) => {
    function jsonReader(filePath, cb) {
        fs.readFile(filePath, (err, fileData) => {
            if (err) {
                return cb && cb(err)
            }
            try {
                const object = JSON.parse(fileData)
                return cb && cb(null, object)
            } catch(err) {
                return cb && cb(err)
            }
        })
    }

    let json = ""
    jsonReader('./log_channel.json', (err, result) => {
        if (err) return console.log(err)
        json = result
        try {
            json.log_channel = message.mentions.channels.first().id || message.guild.channels.cache.get(args[0]).id
            const jsonString = JSON.stringify(json, null, 2)
            fs.writeFileSync('./log_channel.json', jsonString)
            message.channel.send(`Log channel is now <#${json.log_channel}>`)
        } catch (e) {
            message.channel.send("Ce channel est introuvable")
        }
    })
}

module.exports.help = COMMANDS.ADMINISTRATOR.SETLOGS;
