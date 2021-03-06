'use strict';

const game = require("../services/game");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    populate: async (ctx) => {
        console.log("Initializing");

        const options = {
            sort: "popularity",
            page: "1",
            price: "free",
            // ...ctx.query
        };

        await game.populate(options);

        ctx.send({ ok: true });
    }
};
