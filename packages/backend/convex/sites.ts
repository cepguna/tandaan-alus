// convex/category/createSites.ts
import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const addSites = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    link: v.string(),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId) {
      return await ctx.db.insert('sites', { ...args, userId });
    }
  },
});

export const getAllSites = query({
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    return await ctx.db
      .query('sites')
      .filter(q => q.eq(q.field('userId'), userId))
      .collect();
  },
});

export const getSitesByLink = query({
  args: {
    link: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    return await ctx.db
      .query('sites')
      .filter(q => q.eq(q.field('link'), args.link))
      .filter(q => q.eq(q.field('userId'), userId))
      .collect();
  },
});

export const checkSitesByLink = mutation({
  args: {
    link: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    return await ctx.db
      .query('sites')
      .filter(q => q.eq(q.field('link'), args.link))
      .filter(q => q.eq(q.field('userId'), userId))
      .first();
  },
});

export const getSitesById = query({
  args: {
    id: v.id('sites'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateSites = mutation({
  args: {
    id: v.id('sites'),
    title: v.string(),
    description: v.optional(v.string()),
    link: v.string(),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      link: args.link,
      isPrivate: args.isPrivate,
    });
  },
});

export const deleteSites = mutation({
  args: {
    id: v.id('sites'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
