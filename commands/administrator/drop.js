const { COMMANDS } = require('../../util/HELP');
const { MessageEmbed, Collection} = require('discord.js')
const log_channel = require('../../log_channel.json')
const axios = require('axios')

module.exports.run = async (bot, message, args) => {

    let members = []
    let fails = 0

    const file = message.attachments.first()?.url;
    if (!file) return message.channel.send('Veuillez ajouter un fichier .txt');

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function end(codes) {
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
        await message.guild.channels.cache.get(log_channel.log_channel).send({ embeds: [embed]})
        await message.guild.channels.cache.get(log_channel.log_channel).send("__**Code restants :**__")

        const nb_bloc = Math.ceil((codes.toString().split(",").join("\n").length) / 2000)
        const code_per_bloc = Math.ceil(codes.length / nb_bloc)
        let stade = 0

        for (let i = 0; i < nb_bloc; i++) {
            await message.guild.channels.cache.get(log_channel.log_channel).send(`${codes.slice(stade, stade + code_per_bloc).toString().split(",").join("\n")}`)
            stade+=code_per_bloc
        }

        await message.channel.send(`All promote code sended (${members.length-fails} winners)`)

        return members = []
    }

    try {
        const response = await axios.get(file);

        if (response.status !== 200)
            return message.channel.send(
                "Une erreur est survenue lors de l'accès au fichier",
                response.statusText,
            );

        const text = await response.data;

        if (!text) {
            return message.channel.send("Une erreur est survenue lors de la lecture du fichier");
        }

        let codes = text.split("\n")

        message.channel.send("Envoies des codes en cours...")

        for (const arg of codes) {
            let sended = false
            let member = ""
            while (!sended) {
                if (members.length === message.guild.members.cache.filter(m => !m.user.bot).size) {
                    console.log("/!\\ - No more member to send message")
                    return end(codes)
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
                    await sleep(20000)
                } catch (e) {
                    fails++
                    await sleep(20000)
                }
            }
        }
        end(codes)

    } catch (error) {
        console.log(error);
    }
}

module.exports.help = COMMANDS.ADMINISTRATOR.DROP;
