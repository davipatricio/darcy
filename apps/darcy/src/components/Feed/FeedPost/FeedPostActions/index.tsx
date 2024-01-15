'use client';

import { apiClient } from '@/api/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { BiRepost } from 'react-icons/bi';
import { MdFavorite, MdOutlineFavoriteBorder, MdOutlineSpeakerNotes, MdViewKanban } from 'react-icons/md';

interface FeedPostActionsProps {
  comments: number;
  reposts: number;
  likes: number;
  views: number;
  postId: string;
  hasLiked: boolean;
  hasReposted: boolean;
}

export default function FeedPostActions({ comments, reposts, likes, views, postId, hasLiked, hasReposted }: FeedPostActionsProps) {
  const currentUser = useCurrentUser();

  const LikedIcon = hasLiked ? MdFavorite : MdOutlineFavoriteBorder;

  const handleLike = async () => {
    if (hasLiked) apiClient.delete(`/post/${postId}/like`);
    else apiClient.post(`/post/${postId}/like`);
  };

  const handleRepost = async () => {
    console.log('Reposting post', postId);
  };

  return (
    <footer className="mt-2 flex justify-evenly text-sm text-gray-500">
      <button className="group flex select-none items-center gap-1 hover:text-blue" type="button">
        <div className="rounded-full p-1.5 group-hover:bg-blue/20">
          <MdOutlineSpeakerNotes className="h-4 w-4" />
        </div>
        <span>{comments}</span>
      </button>

      <button
        className="group flex select-none items-center gap-1 enabled:hover:text-green data-[reposted='true']:text-green disabled:cursor-not-allowed"
        data-reposted={hasReposted}
        type="button"
        onClick={handleRepost}
        disabled={!currentUser.token}
      >
        <div className="rounded-full p-1.5 group-enabled:hover:bg-green/20">
          <BiRepost className="h-4 w-4" />
        </div>
        <span>{reposts}</span>
      </button>

      <button
        className="group flex select-none items-center gap-1 enabled:hover:text-red data-[liked='true']:text-red disabled:cursor-not-allowed"
        data-liked={hasLiked}
        type="button"
        onClick={handleLike}
        disabled={!currentUser.token}
      >
        <div className="rounded-full p-1.5 group-enabled:hover:bg-red/20">
          <LikedIcon className="h-4 w-4" />
        </div>
        <span>{likes}</span>
      </button>

      <button className="group flex select-none items-center gap-1 hover:text-purple-300" type="button">
        <div className="rounded-full p-1.5 group-hover:bg-purple-500/20">
          <MdViewKanban className="h-4 w-4" />
        </div>
        <span>{views}</span>
      </button>
    </footer>
  );
}
