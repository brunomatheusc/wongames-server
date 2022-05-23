'use strict';

const stripe = require('stripe')(process.env.STRIPE_KEY);
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
	createPaymentIntent: async (ctx) => {
		const { cart } = ctx.request.body;

		const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);

		const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

		if (!games.length) {
			ctx.response.status = 404;

			return { error: "No valid games found!" };
		}

		const total = await strapi.config.functions.cart.total(games);

		if (total === 0) {
			return { freeGames: true };
		}

		const total_in_cents = total * 100;

		try {
			const paymentIntent = await stripe.paymentIntents.create({
				amount: total_in_cents,
				currency: 'usd',
				metadata: {
					integration_check: "accept_a_payment",
					cart: JSON.stringify(cartGamesIds)
				}
			});

			return paymentIntent;
		} catch (error) {
			return { error: error.raw.message };
		}
	},

	create: async (ctx) => {
		const { cart, paymentIntentId, paymentMethod } = ctx.request.body;
		const token = await strapi.plugins["users-permissions"].services.jwt.getToken(ctx);

		const { id: userId } = token;

		const userInfo = await strapi.query("user", "users-permissions").findOne({ id: userId });

		const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);
		const games = await strapi.config.functions.cart.cartItems(cartGamesIds);
		const total_in_cents = await strapi.config.functions.cart.total(games);

		const entry = {
			total_in_cents,
			payment_intent_id: paymentIntentId,
			card_brand: null,
			card_last4: null,
			games,
			user: userInfo,
		};

		const entity = await strapi.services.order.create(entry);

		return sanitizeEntity(entity, { model: strapi.models.order });
		return { cart, userInfo, games, total_in_cents };
	},
};
