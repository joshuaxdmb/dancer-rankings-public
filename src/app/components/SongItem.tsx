import { SongLocal } from '@/types/types';
import React from 'react';
import {
  BsArrowUpCircleFill as ArrowUp,
  BsArrowDownCircleFill as ArrowDown,
} from 'react-icons/bs';

type Props = {
  song: SongLocal;
  onVote: (song: SongLocal, vote: 1 | -1) => void;
  userVote: 1 | -1 | undefined;
};

const SongItem = ({ song, onVote, userVote }: Props) => {
  return (
    <div className="mx-4 flex flex-row justify-between items-center mt-2 border-b border-gray-800">
      <button className="flex flex-col pb-2 cursor-pointer">
        <h2 className="text-md">{song.title}</h2>
        <p className="text-sm text-gray-400">{song.author}</p>
      </button>
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col items-center">
          <ArrowUp onClick={()=>{onVote(song,1)}} className={`cursor-pointer hover:opacity-75 ${userVote===1 && 'text-green-500'}`} size={24} />
          <div className={`text-xs text-gray-400`}>{song.up_votes || 0}</div>
        </div>
        <div className="flex flex-col items-center">
          <ArrowDown className={`cursor-pointer hover:opacity-75 ${userVote===-1 && 'text-green-500'}`} size={24} onClick={()=>{onVote(song,-1)}}/>
          <div className="text-xs text-gray-400">{song.down_votes || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default SongItem;
