const { COMMANDS } = require('../../util/HELP');
const { MessageEmbed } = require('discord.js')

module.exports.run = async (bot, message, args) => {
    let embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({
            format: 'png',
            dynamic: true,
            size: 1024
        }))
        .setColor(bot.config.setting.color)
        .setTitle('__**» Ping...**__')
        .addField(
            "Latence du bot",
            "Chargement...",
            true)
        .addField(
            "Latence avec l'API",
            "Chargement...",
            true)
        .setTimestamp()

    message.channel.send({ embeds: [embed] }).then(async msg => {
        let ping = msg.createdAt - message.createdAt + "ms"
        let pingapi = Math.round(bot.ws.ping) + "ms"

        let embed2 = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 1024
            }))
            .setColor(bot.config.setting.color)
            .setTitle('__**» Pong !**__')
            .addField(
                "Latence du bot",
                ping,
                true)
            .addField(
                "Latence avec l'API",
                pingapi,
                true)
            .setTimestamp()
        msg.edit({ embeds: [embed2] });
    });
}

module.exports.help = COMMANDS.ADMINISTRATOR.LATENCY;
