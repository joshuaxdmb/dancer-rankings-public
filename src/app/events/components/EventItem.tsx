import { DanceLevelsEnum } from '@/types/danceClassesTypes';
import { EventByVotesType } from '@/types/types';
import { toBeautifulDateTime } from '@/utils/utils';
import Image from 'next/image';
import React from 'react';
import {
  BsArrowUpCircleFill as ArrowUp,
} from 'react-icons/bs';
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation';

type Props = {
  event: EventByVotesType;
  onVote: (event: any) => void;
  userVote: boolean;
}

const getBroadCategory = (level: DanceLevelsEnum): string => {
  switch (level) {
    case DanceLevelsEnum.beginner1:
    case DanceLevelsEnum.beginner2:
      return 'Beginner';
    case DanceLevelsEnum.intermediate1:
    case DanceLevelsEnum.intermediate2:
      return 'Intermediate';
    case DanceLevelsEnum.advanced:
      return 'Advanced';
    default:
      return '';
  }
};

const getLevelsTitle = (levels: DanceLevelsEnum[]): string => {
  const allLevels = Object.values(DanceLevelsEnum);

  // Convert the input levels into their corresponding index values
  const levelIndices = levels.map((level) => allLevels.indexOf(level));

  // Find the minimum and maximum index values
  const minIndex = Math.min(...levelIndices);
  const maxIndex = Math.max(...levelIndices);

  // If the min and max are the same broad category, just return that
  if (
    getBroadCategory(allLevels[minIndex]) ===
    getBroadCategory(allLevels[maxIndex])
  ) {
    return getBroadCategory(allLevels[minIndex]);
  }

  // Construct the title using the broad categories corresponding to minIndex and maxIndex
  return `${getBroadCategory(allLevels[minIndex])}/${getBroadCategory(
    allLevels[maxIndex]
  )}`;
};

const EventItem = ({ event, onVote, userVote }: Props) => {
  let classes_included: string[] = [];
  const router = useRouter()

  if (typeof event.classes_included === 'string') {
    classes_included =
      event.classes_included
        .match(/'([^']+)'/g)
        ?.map((item) => item.replace(/'/g, '')) || [];
  } else {
    classes_included = event.classes_included || [];
  }

  console.log(classes_included)

  const goToEvent = () =>{
    router.push('/events/details/?id='+event.id)
  }

  return (
    <div className="itesm-center flex flex-col px-4 mt-2 border-b border-gray-800 pb-4 justify-center">
      <div
        className=" flex flex-row justify-between items-center w-full gap-2 xl:px-20
    "
      >
        <Image
          alt="song-image"
          src={event.image_path || '/assets/icons/spotify.svg'}
          height={80}
          width={80}
          style={{objectFit: 'cover', height:80}}
        />
        <button
          onClick={goToEvent}
          className="flex flex-col cursor-pointer text-left flex-grow truncate"
        >
          <h2 className={`text-md w-full truncate`}>{event.label}</h2>
          <p className="text-sm text-gray-300 w-full truncate">{event.venue}</p>
          <p className="text-xs text-gray-400 w-full truncate">
            Starts: {toBeautifulDateTime(event.start_time)}
          </p>
          <p className="text-xs text-gray-400 w-full truncate">
            Ends: {toBeautifulDateTime(event.end_time)}
          </p>
          <div className="flex-row flex items-center">
            <p className="text-sm text-gray-300 w-full">
              See Details
            </p>
            <FaExternalLinkAlt size={16} className="ml-2 text-gray-300" />
          </div>
        </button>
        <div className="flex flex-col items-center">
          <ArrowUp
            onClick={() => {
              onVote(event.id);
            }}
            className={`cursor-pointer hover:opacity-75 ${
              userVote && 'text-green-500'
            }`}
            size={24}
          />
          <div className={`text-xs text-gray-400`}>
            {event.total_votes || 0}
          </div>
        </div>
      </div>
      {/* {expand && (
        <div className='xl:px-20'>
          {classes_included?.length > 0 && (
            <p className="text-sm text-gray-200 w-full">Included Classes:</p>
          )}
          {classes_included.map((c, index) => (
            <p key={index} className="text-sm text-gray-400 w-full">
              {c as string}
            </p>
          ))}
          <div className='flex flex-col sm:flex-row w-full items-center justify-center gap-2 mt-2'>
          {event.event_site && (
            <SytledButton className="max-w-[300px] bg-white" >
              <a target='_blank' href={event.event_site} className="text-sm text-black w-full flex justify-center items-center pt-1">
              <p>Event Website</p> <HiArrowTopRightOnSquare size={20} className="ml-2 mb-1 inline-block" />
              </a>
            </SytledButton>
          )}
          {event.location_link && (
            <SytledButton className="max-w-[300px] bg-white ">
              <a target='_blank' href={event.location_link} className='text-sm text-black0 w-full flex justify-center items-center pt-1'>
              <p>Get Directions</p> <HiMapPin size={20} className="ml-2 inline-block mb-1" />
              </a>
            </SytledButton>
          )}
          {
            event.playlist_id && (
              <SytledButton className="max-w-[300px] bg-spotify-green ">
                <a target='_blank' href={getUrl()+'party-playlist?id='+event.playlist_id} className='text-sm text-black0 w-full flex justify-center items-center pt-1'>
                <p>Event Playlist</p> <BiSolidParty size={20} className="ml-2 inline-block mb-1" />
                </a>
              </SytledButton>
            )
          }
          </div>
        </div>
        
      )} */}
    </div>
  );
};

export default EventItem;
