import { apiClient } from '@/api/client';
import { GetUserPostsResponse } from '@/app/api/users/[handle]/posts/route';
import { GetUserResponse } from '@/app/api/users/[handle]/route';
import { FeedHeader } from '@/components/feed';
import UserProfilePage from '@/features/pages/user-profile';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

interface HomeProps {
  params: {
    handle: string;
  };
}

export default async function Home({ params }: HomeProps) {
  const handle = decodeURIComponent(params.handle);

  if (handle.startsWith('@')) {
    redirect(`/${handle.replace('@', '')}`);
  }

  const user = await apiClient.get(`users/${handle}`, {
    throwHttpErrors: false
  });
  const data = (await user.json()) as GetUserResponse;

  if (user.status !== 200) {
    notFound();
  }

  if (data.private) {
    return (
      <>
        <FeedHeader className="flex items-center gap-4 p-2">
          <Link className="rounded-full hover:bg-accent p-2" href="/">
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-lg font-bold">{data.displayName}</h1>
            <p className="text-sm text-muted-foreground">{data.postCount} posts</p>
          </div>
        </FeedHeader>

        <UserProfilePage initialData={{ ...data }} initialPosts={[]} />

        <div className="text-center my-4">
          <h1 className="font-bold">This user has a private profile.</h1>
          <p>You must follow them to view their posts.</p>
        </div>
      </>
    );
  }

  const posts = await apiClient.get(`users/${handle}/posts`);
  const postsData = (await posts.json()) as GetUserPostsResponse;

  return (
    <>
      <FeedHeader className="flex items-center gap-4 p-2 backdrop-blur-md">
        <Link className="rounded-full hover:bg-accent p-2" href="/">
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-lg font-bold">{data.displayName}</h1>
          <p className="text-sm text-muted-foreground">{data.postCount} posts</p>
        </div>
      </FeedHeader>

      {/* @ts-ignore */}
      <UserProfilePage initialData={{ ...data }} initialPosts={postsData} />
    </>
  );
}
