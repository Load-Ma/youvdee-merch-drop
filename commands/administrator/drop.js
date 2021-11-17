const { COMMANDS } = require('../../util/HELP');
const { MessageEmbed, Collection} = require('discord.js')
const log_channel = require('../../log_channel.json')

module.exports.run = async (bot, message, args) => {

    // https://stackoverflow.com/questions/67652628/reading-file-attachments-ex-txt-file-discord-js

    let codes = args[0].split("\n")

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function end() {
        const nb_code = codes.length
        codes.splice(0, members.length-fails)
        const embed = new MessageEmbed()
            .setColor(bot.config.setting.color)
            .setTitle("Envoie terminé")
            .setDescription("Tous les codes promotions ont été envoyés")
            .addFields([
                {
                    name: "Succès",
                    value: `${members.length-fails}/${nb_code}`,
                    inline: true
                },
                {
                    name: "Échecs",
                    value: `${fails} (dm bloqués)`,
                    inline: true
                },
                {
                    name: "Restants",
                    value: `${codes.length >= 0 ? codes.length : "Aucun"}`,
                    inline: true
                },
            ])
        message.guild.channels.cache.get(log_channel.log_channel).send({ embeds: [embed]})
        message.guild.channels.cache.get(log_channel.log_channel).send(`__**Code restants :**__ \n${codes.toString().split(",").join("\n")}`)
        message.channel.send(`All promote code sended (${members.length-fails} winners)`)
        return members = []
    }
    let members = []
    let fails = 0

    for (const arg of codes) {
        let sended = false
        let member = ""
        while (!sended) {
            if (members.length === message.guild.members.cache.filter(m => !m.user.bot).size) {
                console.log("/!\\ - No more member to send message")
                return end()
            }
            while (member === "" || members.includes(member) || member.user.bot) {
                member = message.guild.members.cache.random()
            }
            members.push(member)
            let dm = await member.createDM()
            try {
                const embed = new MessageEmbed()
                    .setAuthor(`Salut ${member.user.username}`, member.user.displayAvatarURL({dynamic: true}))
                    .setTitle("Tiens, un code promo :gift: !")
                    .setDescription(`Pendant que je pêchais, j'ai senti un code du bout de ma truffe.\n\n**CODE : ${arg}**`)
                    .setColor(bot.config.setting.color)
                    .setFooter("En cas de problème, merci de contacter un administrateur.")
                    .setImage("https://cdn.discordapp.com/attachments/581189446582534145/909139653322481694/chopper.gif")
                await dm.send({embeds: [embed]})
                console.log(`sended promote "${arg}" to member "${member.user.username}"`)
                sended = true
            } catch (e) {
                fails++
            }
        }
        await sleep(6000)
    }
    end()
}

module.exports.help = COMMANDS.ADMINISTRATOR.DROP;
