import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';

export const addSites = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    link: v.string(),
    isPrivate: v.boolean(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized: User must be logged in');
    }

    // Check if the link already exists
    const existingSite = await ctx.db
      .query('sites')
      .filter(q => q.eq(q.field('link'), args.link))
      .first();

    let siteId: Id<'sites'>;
    if (existingSite) {
      siteId = existingSite._id;
    } else {
      siteId = await ctx.db.insert('sites', {
        title: args.title,
        description: args.description,
        link: args.link,
      });
    }

    // Check if user is already associated with this site
    const existingSiteUser = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('userId'), userId))
      .filter(q => q.eq(q.field('siteId'), siteId))
      .first();

    if (!existingSiteUser) {
      await ctx.db.insert('siteUsers', {
        userId,
        siteId,
        isPrivate: args.isPrivate,
        tags: args.tags ?? [],
      });
    }

    return siteId;
  },
});

export const getAllMySites = query({
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const siteUsers = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('userId'), userId))
      .collect();

    const sites = await Promise.all(
      siteUsers.map(async siteUser => {
        const site = await ctx.db.get(siteUser.siteId);
        if (!site) return null;
        return {
          ...site,
          isPrivate: siteUser.isPrivate,
          tags: siteUser.tags ?? [],
        };
      }),
    );

    return sites.filter((site): site is NonNullable<typeof site> => site !== null);
  },
});

export const getSitesByLink = query({
  args: {
    link: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const site = await ctx.db
      .query('sites')
      .filter(q => q.eq(q.field('link'), args.link))
      .first();

    if (!site) {
      return [];
    }

    const siteUser = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('userId'), userId))
      .filter(q => q.eq(q.field('siteId'), site._id))
      .first();

    if (!siteUser) {
      return [];
    }

    return [{ ...site, isPrivate: siteUser.isPrivate, tags: siteUser.tags ?? [] }];
  },
});

export const checkSitesByLink = mutation({
  args: {
    link: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const site = await ctx.db
      .query('sites')
      .filter(q => q.eq(q.field('link'), args.link))
      .first();

    if (!site) {
      return null;
    }

    const siteUser = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('userId'), userId))
      .filter(q => q.eq(q.field('siteId'), site._id))
      .first();

    if (!siteUser) {
      return null;
    }

    return { ...site, isPrivate: siteUser.isPrivate, tags: siteUser.tags ?? [] };
  },
});

export const getSitesById = query({
  args: {
    id: v.id('sites'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const site = await ctx.db.get(args.id);
    if (!site) {
      return null;
    }

    const siteUser = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('userId'), userId))
      .filter(q => q.eq(q.field('siteId'), site._id))
      .first();

    if (!siteUser) {
      return null;
    }

    return { ...site, isPrivate: siteUser.isPrivate, tags: siteUser.tags ?? [] };
  },
});

export const updateSites = mutation({
  args: {
    id: v.id('sites'),
    description: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized: User must be logged in');
    }

    // Verify the site exists
    const site = await ctx.db.get(args.id);
    if (!site) {
      throw new Error('Site not found');
    }

    // Update sites table
    await ctx.db.patch(args.id, {
      description: args.description,
    });

    // Update isPrivate and tags in siteUsers table
    const siteUser = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('userId'), userId))
      .filter(q => q.eq(q.field('siteId'), args.id))
      .first();

    if (siteUser) {
      await ctx.db.patch(siteUser._id, {
        isPrivate: args.isPrivate ?? siteUser.isPrivate,
        tags: args.tags,
      });
    } else {
      await ctx.db.insert('siteUsers', {
        userId,
        siteId: args.id,
        isPrivate: args.isPrivate ?? false,
        tags: args.tags,
      });
    }
  },
});

export const removeSites = mutation({
  args: {
    siteId: v.id('sites'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized: User must be logged in');
    }

    // Verify the site exists
    const site = await ctx.db.get(args.siteId);
    if (!site) {
      throw new Error('Site not found');
    }

    // Find the siteUsers record for this user and site
    const siteUser = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('userId'), userId))
      .filter(q => q.eq(q.field('siteId'), args.siteId))
      .first();

    if (!siteUser) {
      throw new Error('Bookmark not found for this user');
    }

    // Delete the siteUsers record
    await ctx.db.delete(siteUser._id);

    // Check if other users are associated with this site
    const otherSiteUsers = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('siteId'), args.siteId))
      .collect();

    // If no other users are associated, delete the site
    if (otherSiteUsers.length === 0) {
      await ctx.db.delete(args.siteId);
    }

    return { success: true, siteId: args.siteId };
  },
});

export const getMostBookmarkedPublicSites = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const xsiteCounts = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('isPrivate'), false))
      .collect();

    const siteCounts = xsiteCounts.reduce(
      (acc, siteUser) => {
        const siteId = siteUser.siteId;
        acc[siteId] = (acc[siteId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const sortedSites = await Promise.all(
      Object.entries(siteCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, limit)
        .map(async ([siteId]) => {
          const site = await ctx.db.get(siteId as Id<'sites'>);
          if (!site) return null;

          const tags = await ctx.db
            .query('siteUsers')
            .filter(q => q.eq(q.field('siteId'), siteId))
            .filter(q => q.eq(q.field('isPrivate'), false))
            .collect()
            .then(siteUsers => Array.from(new Set(siteUsers.flatMap(su => su.tags ?? []))));

          return {
            ...site,
            bookmarkCount: siteCounts[siteId],
            tags,
            isPrivate: false,
          };
        }),
    );

    return sortedSites.filter((site): site is NonNullable<typeof site> => site !== null);
  },
});

export const getLatestPublicSites = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    // Get all public siteUsers
    const publicSiteUsers = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('isPrivate'), false))
      .collect();

    // Sort by creation time descending (latest first)
    const sortedPublicSiteUsers = publicSiteUsers.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0));

    // Deduplicate sites by siteId to avoid duplicates
    const uniqueSiteUserMap = new Map<string, (typeof publicSiteUsers)[number]>();

    for (const su of sortedPublicSiteUsers) {
      if (!uniqueSiteUserMap.has(su.siteId)) {
        uniqueSiteUserMap.set(su.siteId, su);
      }
      if (uniqueSiteUserMap.size >= limit) break;
    }

    const uniqueSiteUsers = Array.from(uniqueSiteUserMap.values());

    const results = await Promise.all(
      uniqueSiteUsers.map(async su => {
        const site = await ctx.db.get(su.siteId as Id<'sites'>);
        if (!site) return null;

        return {
          ...site,
          siteUserId: su._id,
          tags: su.tags ?? [],
          isPrivate: false,
          createdBy: su.userId,
        };
      }),
    );

    return results.filter((site): site is NonNullable<typeof site> => site !== null);
  },
});

export const getTopUsersByPublicBookmarks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const xuserCounts = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('isPrivate'), false))
      .collect();

    const userCounts = xuserCounts.reduce(
      (acc, siteUser) => {
        const userId = siteUser.userId;
        acc[userId] = (acc[userId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const sortedUsers = await Promise.all(
      Object.entries(userCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, limit)
        .map(async ([userId, bookmarkCount]) => {
          const user = await ctx.db.get(userId as Id<'users'>);
          if (!user || !user.username || user.username.trim() === '') {
            return null;
          }

          const tags = await ctx.db
            .query('siteUsers')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.eq(q.field('isPrivate'), false))
            .collect()
            .then(siteUsers => Array.from(new Set(siteUsers.flatMap(su => su.tags ?? []))));

          return {
            userId,
            bookmarkCount,
            tags,
            name: user.name ?? 'Anonymous',
            email: user.email ?? '',
            username: user.username,
          };
        }),
    );

    return sortedUsers.filter((user): user is NonNullable<typeof user> => user !== null);
  },
});

export const getPublicSitesByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.username || args.username.trim() === '' || args.username.length <= 2) {
      return {
        sites: [],
        user: null,
        error: 'Valid username is required',
      };
    }

    try {
      const users = await ctx.db
        .query('users')
        .filter(q => q.eq(q.field('username'), args.username.toLowerCase()))
        .take(1);
      const user = users[0];

      if (!user) {
        return {
          sites: [],
          user: null,
          error: `User with username "${args.username}" not found`,
        };
      }

      const siteUsers = await ctx.db
        .query('siteUsers')
        .filter(q => q.eq(q.field('userId'), user._id))
        .filter(q => q.eq(q.field('isPrivate'), false))
        .collect();

      const sites = await Promise.all(
        siteUsers.map(async siteUser => {
          const site = await ctx.db.get(siteUser.siteId);
          if (!site) return null;
          return {
            ...site,
            isPrivate: siteUser.isPrivate,
            tags: siteUser.tags ?? [],
          };
        }),
      );

      return {
        sites: sites.filter((site): site is NonNullable<typeof site> => site !== null),
        user: {
          userId: user._id,
          username: user.username,
          name: user.name ?? 'Anonymous',
          email: user.email ?? '',
          urls: user.urls ?? [],
        },
        error: null,
      };
    } catch (error) {
      console.error('Error fetching public sites by username:', error);
      return {
        sites: [],
        user: null,
        error: 'An error occurred while fetching data',
      };
    }
  },
});
