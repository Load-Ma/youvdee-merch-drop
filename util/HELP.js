const COMMANDS = {
    ADMINISTRATOR: {
        DROP: {
            name: "drop",
            aliases: ["give", "giveaway"],
            category: "administrator",
            description: "Lancer le give de code promo",
            usage: "<codes_promo>",
            cooldown: 5,
            permissions: "",
            auth: "admin",
            args: "false"
        },
        SETLOGS: {
            name: "setlogs",
            aliases: ["setlog"],
            category: "administrator",
            description: "Définir le salon des logs",
            usage: "<setup/nom-channel>",
            cooldown: 5,
            permissions: "",
            auth: "admin",
            args: "true"
        },
        HELP: {
            name: "help",
            aliases: ["h"],
            category: "administrator",
            description: "Montre la liste des commandes",
            usage: "[nom_commande]",
            cooldown: 0,
            permissions: "",
            auth: "admin",
            args: "none"
        },
        LATENCY: {
            name: "latency",
            aliases: ["ms"],
            category: "administrator",
            description: "Donne la latence du bot",
            usage: "",
            cooldown: 0,
            permissions: "",
            auth: "admin",
            args: "false"
        },
    },
    DEVELOPPER: {
        RELOAD: {
            name: "reload",
            aliases: ["rl"],
            category: "developper",
            description: "Reload une commande",
            usage: "<commande>",
            permissions: "",
            cooldown: 3,
            auth: "dev",
            args: "true"
        },
    },
}

module.exports.COMMANDS = COMMANDS;
