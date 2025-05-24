import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // other "users" fields...
  }).index('email', ['email']),
  sites: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    link: v.string(),
  }).index('by_link', ['link']),
  siteUsers: defineTable({
    userId: v.id('users'),
    siteId: v.id('sites'),
    isPrivate: v.boolean(),
    tags: v.optional(v.array(v.string())),
  }).index('by_userId_siteId', ['userId', 'siteId']),
});
