// convex/category/createNotes.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const createNotes = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('notes', args);
  },
});

export const getAllNotes = query({
  handler: async ctx => {
    return await ctx.db.query('notes').collect();
  },
});

export const getNotesById = query({
  args: {
    id: v.id('notes'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateNotes = mutation({
  args: {
    id: v.id('notes'),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      content: args.content,
      summary: args.summary,
    });
  },
});

export const deleteNotes = mutation({
  args: {
    id: v.id('notes'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
