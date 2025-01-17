import { prisma } from '@/utils/api/prisma';
import requireAuthorization from '@/utils/api/requireAuthorization';
import { patchUserSchema } from '@/utils/api/schemas/user';
import { $Enums } from '@prisma/client';
import { NextRequest } from 'next/server';
import { safeParseAsync } from 'valibot';

interface GetUserOptions {
  params: {
    handle: string;
  };
}

export interface GetUserResponse {
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string | null;
  private: boolean;
  verified: $Enums.VerifiedType;
  createdAt: string;
  updatedAt: string;
  job: string | null;
  location: string | null;
  website: string | null;
  birthday: string | null;
  postCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export async function GET(_request: NextRequest, { params }: GetUserOptions) {
  const authData = await requireAuthorization();

  if (params.handle === '@me') {
    if (!authData.authorized) return authData.response;

    const user = await prisma.user.findFirst({
      where: { auth: { email: authData.email } }
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          error: 'user_not_found',
          message: 'User not found'
        }),
        {
          status: 404
        }
      );
    }

    const followersCount = await prisma.user.count({
      where: {
        followingIds: {
          has: user.id
        }
      }
    });

    return new Response(
      JSON.stringify({ ...user, followersCount, followingCount: user.followingIds.length, followingIds: undefined, id: undefined })
    );
  }

  const user = await prisma.user.findFirst({
    where: { handle: params.handle }
  });

  if (!user) {
    return new Response(
      JSON.stringify({
        error: 'user_not_found',
        message: 'User not found'
      }),
      {
        status: 404
      }
    );
  }

  const [currentUser, followersCount] = await Promise.all([
    authData.authorized
      ? prisma.user.findFirst({
          where: { auth: { email: authData.email } }
        })
      : null,
    prisma.user.count({
      where: {
        followingIds: {
          has: user.id
        }
      }
    })
  ]);

  return new Response(
    JSON.stringify({
      ...user,
      followersCount,
      followingCount: user.followingIds.length,
      isFollowing: currentUser?.followingIds.includes(user.id) ?? false,
      followingIds: undefined,
      id: undefined
    })
  );
}

export async function PATCH(request: NextRequest, { params }: GetUserOptions) {
  // Only allow updating the @me user
  if (params.handle !== '@me') {
    return new Response(
      JSON.stringify({
        error: 'update_user_with_at_handle',
        message: 'To update a user, you must use the @me handle'
      }),
      {
        status: 401
      }
    );
  }

  const data = (await request.json()) as {
    displayName?: string;
    handle?: string;
    bio?: string;
  };

  const parsedData = await safeParseAsync(patchUserSchema, data);
  if (!parsedData.success) {
    return new Response(
      JSON.stringify({
        error: parsedData.issues[0].message
      }),
      {
        status: 400
      }
    );
  }

  const authData = await requireAuthorization();
  if (!authData.authorized) return authData.response;

  const user = await prisma.user.findFirst({
    where: { auth: { email: authData.email } }
  });

  if (!user) {
    return new Response(
      JSON.stringify({
        error: 'user_not_found',
        message: 'User not found'
      }),
      {
        status: 404
      }
    );
  }

  if (data.handle) {
    const handleExists = await prisma.user.findFirst({
      where: { handle: { mode: 'insensitive', equals: data.handle } }
    });

    if (handleExists && user.id !== handleExists.id && data.handle !== user.handle) {
      return new Response(
        JSON.stringify({
          error: 'handle_already_user',
          message: 'Handle is being used by another user'
        }),
        {
          status: 400
        }
      );
    }
  }

  const [newUser, followersCount] = await Promise.all([
    prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: data.displayName || user.displayName,
        handle: data.handle || user.handle,
        bio: data.bio || user.bio
      }
    }),
    prisma.user.count({
      where: {
        followingIds: {
          has: user.id
        }
      }
    })
  ]);

  return new Response(
    JSON.stringify({ ...newUser, followersCount, followingCount: user.followingIds.length, followingIds: undefined, id: undefined })
  );
}
