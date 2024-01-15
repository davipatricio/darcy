import { prisma } from '@/utils/api/prisma';
import requireAuthorization from '@/utils/api/requireAuthorization';
import { NextRequest } from 'next/server';

interface LikePostOptions {
  params: {
    postId: string;
  };
}

export async function POST(_request: NextRequest, { params }: LikePostOptions) {
  const authData = await requireAuthorization();
  if (!authData.authorized) return authData.response;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      auth: {
        email: authData.email
      }
    }
  });

  const post = await prisma.post.findUnique({
    where: {
      id: params.postId
    }
  });

  if (!post) {
    return new Response('Post not found', {
      status: 404
    });
  }

  if (post.likedIds.includes(user.id)) {
    return new Response('Already liked', {
      status: 400
    });
  }

  await prisma.post.update({
    where: {
      id: params.postId
    },
    data: {
      likedIds: {
        push: user.id
      }
    }
  });

  return new Response('', {
    status: 200
  });
}

export async function DELETE(_request: NextRequest, { params }: LikePostOptions) {
  const authData = await requireAuthorization();
  if (!authData.authorized) return authData.response;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      auth: {
        email: authData.email
      }
    }
  });

  const post = await prisma.post.findUnique({
    where: {
      id: params.postId
    }
  });

  if (!post) {
    return new Response('Post not found', {
      status: 404
    });
  }

  if (!post.likedIds.includes(user.id)) {
    return new Response('Not liked', {
      status: 400
    });
  }

  await prisma.post.update({
    where: {
      id: params.postId
    },
    data: {
      likedIds: {
        set: post.likedIds.filter((id) => id !== user.id)
      }
    }
  });

  return new Response('', {
    status: 200
  });
}
