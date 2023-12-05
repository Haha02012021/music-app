import { React, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as apis from "../apis";
import icons from "../utils/icons";
import * as actions from "../store/actions";
import moment from "moment";
import { toast } from "react-toastify";
import RotateLine from "./LoadingEffect/RotateLine";

const {
  AiFillHeart,
  AiOutlineHeart,
  BsPlusLg,
  PiShuffleLight,
  PiRepeatOnceLight,
  PiRepeatLight,
  TbPlayerPlayFilled,
  TbPlayerPauseFilled,
  BiSkipNext,
  BiSkipPrevious,
  PiPlaylistLight,
  SlVolumeOff,
  SlVolume2,
} = icons;

var intervalId;

const Player = ({ setOpenRightSideBar, openRightSideBar }) => {
  const { curSongId, isPlaying, id, songs } = useSelector(
    (state) => state.music,
  );
  const { login } = useSelector(state => state.user);
  const [songInfo, setSongInfo] = useState(null);
  const [playingTime, setPlayingTime] = useState(0);
  const [audio, setAudio] = useState(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(100);
  const [liked, setLiked] = useState(false);
  const thumref = useRef();
  const trackref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchInfoSong = async () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsLoaded(false);
      const res = await apis.apiGetSong(curSongId);
      setIsLoaded(true);
      if (res?.status === 200) {
        setSongInfo(res?.data?.data);
        setLiked(res?.data?.data?.is_liked);
        dispatch(actions.setCurSongData(res?.data?.data));
        intervalId && clearInterval(intervalId);
        const listRes = await apis.apiListenMusic(
          res?.data?.data?.id,
          res?.data?.data?.album_id,
        );
        const newAudio = new Audio(res?.data?.data?.audio);
        newAudio.load();
        if (isPlaying) newAudio.play();
        setAudio(newAudio);
      } else {
        audio.pause();
        intervalId && clearInterval(intervalId);
        dispatch(actions.playSong(false));
        toast.warn(res?.data?.msg);
        audio.currentTime = 0;
        setPlayingTime(0);
        thumref.current.style.cssText = `right: 100%`;
      }
    };

    fetchInfoSong();
  }, [curSongId]);

  useEffect(() => {
    // intervalId && clearInterval(intervalId);
    if (audio) {
      intervalId = setInterval(() => {
        var per =
          Math.round((audio.currentTime * 10000) / songInfo?.duration) / 100;
        thumref.current.style.cssText = `right: ${100 - per}%`;
        setPlayingTime(Math.round(audio.currentTime));
      }, 200);
    }
  }, [audio]);

  useEffect(() => {
    const endSong = () => {
      if (isRepeat) {
        isRepeat === 1 ? handleNextSong() : repeatOne();
      } else if (isShuffle) {
        shuffleSong();
      } else {
        audio.pause();
        dispatch(actions.playSong(false));
      }
    };

    audio?.addEventListener("ended", endSong);

    return () => {
      audio?.removeEventListener("ended", endSong);
    };
  }, [audio, isShuffle, isRepeat]);

  const handleTogglePlayMusic = () => {
    if (isPlaying) {
      dispatch(actions.playSong(false));
      audio.pause();
    } else {
      audio.play();
      dispatch(actions.playSong(true));
    }
  };

  const handleRewind = (e) => {
    const trackRect = trackref?.current?.getBoundingClientRect();
    const per =
      Math.round(((e.clientX - trackRect.left) * 10000) / trackRect.width) /
      100;
    thumref.current.style.cssText = `right: ${100 - per}%`;
    audio.currentTime = (per * songInfo?.duration) / 100;
    setPlayingTime(Math.round(audio.currentTime));
  };

  const handleNextSong = () => {
    if (id !== null && id < songs?.length - 1) {
      dispatch(actions.setCurSongId(songs[id + 1]?.id));
      dispatch(actions.getSongId(id + 1));
      dispatch(actions.playSong(true));
    } else if (id === songs.length - 1 && isRepeat) {
      dispatch(actions.setCurSongId(songs[0]?.id));
      dispatch(actions.getSongId(0));
      dispatch(actions.playSong(true));
    }
  };

  const handlePreSong = () => {
    if (id) {
      dispatch(actions.setCurSongId(songs[id - 1]?.id));
      dispatch(actions.getSongId(id - 1));
      dispatch(actions.playSong(true));
    }
  };

  const shuffleSong = () => {
    const randId = Math.round(Math.random() * songs?.length) - 1;
    dispatch(actions.setCurSongId(songs[randId]?.id));
    dispatch(actions.getSongId(randId));
  };

  const repeatOne = () => {
    audio.play();
  };

  const handleVolume = (e) => {
    setVolume(e.target.value);
    audio.volume = e.target.value / 100;
  };

  const handleClickVolume = () => {
    audio.volume = (100 - volume) / 100;
    volume > 0 ? setVolume(0) : setVolume(100);
  };

  const handleLikeSong = (e) => {
    e.stopPropagation();
    const likeSong = async () => {
      const res = await apis.apiLikeSong(songInfo?.id, 2);
      setLiked((prev) => !prev);
    };
    likeSong();
  };

  return (
    <div className="bg-main-400 border-t-2 px-5 h-full flex z-40">
      <div className="w-[30%] flex items-center gap-3">
        <img
          src={songInfo?.thumbnail}
          alt="thumbnail"
          className="w-16 h-16 object-cover rounded-md"
        />

        <div className="flex flex-col">
          <span className="font-medium text-[#5E5E67]">{songInfo?.name}</span>
          <span className="text-gray-500">{songInfo?.singers[0]?.name}</span>
        </div>

        {login && <div className="flex">
          <span
            className="p-2 mx-[2px] cursor-pointer"
            onClick={handleLikeSong}
          >
            {liked ? (
              <AiFillHeart title="Xoá khỏi thư viện" size={16} />
            ) : (
              <AiOutlineHeart title="Thêm vào thư viện" size={16} />
            )}
          </span>
          <span className="p-2 mx-[2px] cursor-pointer">
            <BsPlusLg title="Thêm vào playlist" size={16} />
          </span>
        </div>}
      </div>

      <div className="flex flex-col flex-auto justify-center items-center">
        <div className="flex gap-8 items-center">
          <span
            onClick={() => {
              if (id !== null) {
                if (!isShuffle) setIsRepeat(0);
                setIsShuffle((prev) => !prev);
              }
            }}
            className={`${id === null ? 'text-gray-400' : isShuffle ? "text-[#9431C6] cursor-pointer" : "text-gray-800 cursor-pointer"}`}
          >
            <PiShuffleLight
              title="Bộ phát ngẫu nhiên"
              size={20}
            />
          </span>
          <span
            onClick={handlePreSong}
            className={`${id ? "cursor-pointer" : "text-gray-200"}`}
          >
            <BiSkipPrevious size={36} />
          </span>
          <span
            onClick={handleTogglePlayMusic}
            className="p-2 cursor-pointer rounded-full
                border hover:text-[#9431C6] hover:border-[#9431C6] border-black"
          >
            {!isLoaded ? (
              <RotateLine width={20} />
            ) : isPlaying ? (
              <TbPlayerPauseFilled size={20} />
            ) : (
              <TbPlayerPlayFilled size={20} />
            )}
          </span>
          <span
            onClick={handleNextSong}
            className={`${id === null || id === songs.length - 1 || songs.length < 2
              ? "text-gray-200"
              : "cursor-pointer"
              }`}
          >
            <BiSkipNext size={36} />
          </span>
          <span
            onClick={() => {
              if (id !== null) {
                if (!isRepeat) setIsShuffle(false);
                if (isRepeat < 2) setIsRepeat(isRepeat + 1);
                else setIsRepeat(0);
              }
            }}
          >
            {isRepeat === 2 && (
              <PiRepeatOnceLight
                className="cursor-pointer text-[#9431C6]"
                title="Tắt bộ phát lại"
                size={20}
              />
            )}
            {isRepeat === 1 && (
              <PiRepeatLight
                className="cursor-pointer text-[#9431C6]"
                title="Bật bộ phát lại 1 bài"
                size={20}
              />
            )}
            {isRepeat === 0 && (
              <PiRepeatLight
                className={`cursor-pointer ${id === null ? 'text-gray-400' : 'text-gray-800'}`}
                title="Bật bộ phát lại tất cả"
                size={20}
              />
            )}
          </span>
        </div>
        <div className="w-full mt-1 flex gap-2 items-center justify-center text-sm">
          <span className="ml-4">
            {moment.utc(playingTime * 1000).format("mm:ss")}
          </span>
          <div
            onClick={handleRewind}
            ref={trackref}
            className="w-4/5 h-[3px] hover:h-2 cursor-pointer bg-gray-300 rounded-l-full rounded-r-full relative"
          >
            <div
              ref={thumref}
              className="bg-main-500 rounded-l-full rounded-r-full absolute left-0 top-0 bottom-0"
            ></div>
          </div>
          <span className="mr-4">
            {moment.utc(songInfo?.duration * 1000).format("mm:ss")}
          </span>
        </div>
      </div>

      <div className="w-[30%] flex items-center justify-end gap-4">
        <span className="text-gray-700" onClick={handleClickVolume}>
          {volume > 0 ? <SlVolume2 size={20} /> : <SlVolumeOff size={20} />}
        </span>
        <input
          type="range"
          step={1}
          min={0}
          max={100}
          value={volume}
          onChange={handleVolume}
        />
        <span
          onClick={() => setOpenRightSideBar(!openRightSideBar)}
          className={`cursor-pointer ${openRightSideBar
            ? "bg-main-500 text-white"
            : "text-gray-800 hover:bg-gray-200"
            } rounded-sm p-1`}
        >
          <PiPlaylistLight size={20} />
        </span>
      </div>
    </div>
  );
};

export default Player;