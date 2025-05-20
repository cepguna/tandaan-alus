import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

export default defineSchema({
  ...authTables,
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }),
  sites: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    link: v.string(),
    isPrivate: v.boolean(),
    userId: v.id('users'),
  }),
});
