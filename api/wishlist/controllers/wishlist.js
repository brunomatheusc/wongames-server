'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	async create(ctx) {
		const token = await strapi.plugins["users-permissions"].services.jwt.getToken(ctx);

		const body = {
			...ctx.request.body,
			user: token.id,
		};

		const entity = await strapi.services.wishlist.create(body);

		return sanitizeEntity(entity, { model: strapi.models.wishlist });
	},

	async update(ctx) {
		try {
			const { params: { id }, request: { body } } = ctx;
			const entity = await strapi.services.wishlist.update({ id }, body);

			return sanitizeEntity(entity, { model: strapi.models.wishlist });
		} catch (error) {
			throw strapi.errors.unauthorized(error);
		}
	}
};
