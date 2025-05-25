import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const me = query({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? ctx.db.get(userId) : null;
  },
});

export const updateUser = mutation({
  args: {
    id: v.id('users'),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
    urls: v.optional(
      v.array(
        v.object({
          type: v.string(),
          link: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }
    if (userId !== args.id) {
      throw new Error('Unauthorized: You can only update your own profile');
    }

    // Check for duplicate username
    if (args.username) {
      const existingUser = await ctx.db
        .query('users')
        .filter(q => q.eq(q.field('username'), args.username))
        .filter(q => q.neq(q.field('_id'), args.id))
        .first();

      if (existingUser) {
        throw new Error('Username is already taken');
      }
    }

    // Update user data
    await ctx.db.patch(args.id, {
      name: args.name,
      image: args.image,
      username: args.username,
      bio: args.bio,
      isPrivate: args.isPrivate,
      urls: args.urls,
    });

    // Return the updated user
    const updatedUser = await ctx.db.get(userId);
    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }
    return updatedUser;
  },
});
