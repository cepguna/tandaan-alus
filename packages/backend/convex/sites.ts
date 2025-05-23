import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

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
      throw new Error('Unauthorized');
    }

    // Check if the link already exists
    const existingSite = await ctx.db
      .query('sites')
      .filter(q => q.eq(q.field('link'), args.link))
      .first();

    let siteId;
    if (existingSite) {
      // Site exists, use its ID
      siteId = existingSite._id;
    } else {
      // Insert new site
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
      // Create siteUsers record
      await ctx.db.insert('siteUsers', {
        userId,
        siteId,
        isPrivate: args.isPrivate,
        tags: args.tags,
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
          tags: siteUser.tags,
        };
      }),
    );

    return sites.filter(site => site !== null);
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

    return [{ ...site, isPrivate: siteUser.isPrivate, tags: siteUser.tags }];
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

    return { ...site, isPrivate: siteUser.isPrivate, tags: siteUser.tags };
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

    return { ...site, isPrivate: siteUser.isPrivate, tags: siteUser.tags };
  },
});

export const updateSites = mutation({
  args: {
    id: v.id('sites'),
    title: v.string(),
    description: v.optional(v.string()),
    link: v.string(),
    isPrivate: v.boolean(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Update sites table
    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      link: args.link,
    });

    // Update isPrivate and tags in siteUsers table
    const siteUser = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('userId'), userId))
      .filter(q => q.eq(q.field('siteId'), args.id))
      .first();

    if (siteUser) {
      await ctx.db.patch(siteUser._id, { isPrivate: args.isPrivate, tags: args.tags });
    } else {
      // If no siteUser record exists, create one
      await ctx.db.insert('siteUsers', {
        userId,
        siteId: args.id,
        isPrivate: args.isPrivate,
        tags: args.tags,
      });
    }
  },
});

export const deleteSites = mutation({
  args: {
    id: v.id('sites'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Delete the siteUsers record for this user and site
    const siteUser = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('userId'), userId))
      .filter(q => q.eq(q.field('siteId'), args.id))
      .first();

    if (siteUser) {
      await ctx.db.delete(siteUser._id);
    }

    // Check if other users are associated with this site
    const otherSiteUsers = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('siteId'), args.id))
      .collect();

    // If no other users are associated, delete the site
    if (otherSiteUsers.length === 0) {
      await ctx.db.delete(args.id);
    }
  },
});

export const getMostBookmarkedPublicSites = query({
  args: {
    limit: v.optional(v.number()), // Optional limit for number of results
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10; // Default to 10 results if not specified

    // Get all public siteUsers entries and group by siteId to count bookmarks
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

    // Convert to array and sort by bookmark count
    const sortedSites = await Promise.all(
      Object.entries(siteCounts)
        .sort(([, countA], [, countB]) => countB - countA) // Sort descending by count
        .slice(0, limit) // Take top N results
        .map(async ([siteId]) => {
          const site = await ctx.db.get(siteId);
          if (!site) return null;

          // Get all tags for this site from public siteUsers
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

    // Filter out any null results and return
    return sortedSites.filter(site => site !== null);
  },
});

export const getTopUsersByPublicBookmarks = query({
  args: {
    limit: v.optional(v.number()), // Optional limit for number of results
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10; // Default to 10 results if not specified

    // Get all public siteUsers entries and group by userId to count bookmarks
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

    // Convert to array and sort by bookmark count
    const sortedUsers = await Promise.all(
      Object.entries(userCounts)
        .sort(([, countA], [, countB]) => countB - countA) // Sort descending by count
        .slice(0, limit) // Take top N results
        .map(async ([userId]) => {
          const user = await ctx.db.get(userId as any);
          if (!user) return null;

          // Get all unique tags from user's public bookmarks
          const tags = await ctx.db
            .query('siteUsers')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.eq(q.field('isPrivate'), false))
            .collect()
            .then(siteUsers => Array.from(new Set(siteUsers.flatMap(su => su.tags ?? []))));

          return {
            userId,
            bookmarkCount: userCounts[userId],
            tags,
            // Include minimal user details (adjust based on your users table schema)
            name: user.name || 'Anonymous',
            email: user.email || '',
          };
        }),
    );

    // Filter out any null results and return
    return sortedUsers.filter(user => user !== null);
  },
});

export const getPublicSitesByUserId = query({
  args: {
    userId: v.id('users'), // Required userId to fetch public sites for
  },
  handler: async (ctx, args) => {
    // Get public siteUsers entries for the specified user
    const user = await ctx.db.get(args.userId as any);
    if (!user) return null;

    const siteUsers = await ctx.db
      .query('siteUsers')
      .filter(q => q.eq(q.field('userId'), args.userId))
      .filter(q => q.eq(q.field('isPrivate'), false))
      .collect();

    // Fetch site details for each public siteUser entry
    const sites = await Promise.all(
      siteUsers.map(async siteUser => {
        const site = await ctx.db.get(siteUser.siteId);
        if (!site) return null;
        return {
          ...site,
          isPrivate: siteUser.isPrivate,
          tags: siteUser.tags,
        };
      }),
    );

    // Filter out any null results and return
    return {
      sites: sites.filter(site => site !== null),
      user: {
        ...user,
        name: user.name ?? 'Anonymous',
      },
    };
  },
});
