import icons from "./icons"

const { MdOutlineLibraryMusic,
    MdOutlineFeed,
    BsDisc,
    TbChartArcs,
    PiMusicNotesPlus,
    TbIcons,
    FaRegStar,
    TbUsersPlus,
    FaIcons,
    RiPlayListAddFill,
    TbMusicPlus,
} = icons;

export const sidebarMenu = [
    {
        path: '',
        text: 'Khám phá',
        end: true,
        icon: <BsDisc size={22} />
    },

    {
        path: 'zing-chart',
        text: '#zingchart',
        icon: <TbChartArcs size={24} />
    },

    {
        path: 'follow',
        text: 'Theo dõi',
        icon: <MdOutlineFeed size={24} />
    },

    {
        path: 'mymusic',
        text: 'Thư viện',
        icon: <MdOutlineLibraryMusic size={24} />
    },

    {
        path: 'moi-phat-hanh',
        text: 'BXH Nhạc Mới',
        icon: <PiMusicNotesPlus size={24} />
    },

    {
        path: 'hub',
        text: 'Chủ đề & Thể loại',
        icon: <TbIcons size={24} />
    },

    {
        path: 'top100',
        text: 'Top 100',
        icon: <FaRegStar size={24} />
    },

    {
        path: 'create-singer',
        text: 'Tạo ca sĩ mới',
        icon: <TbUsersPlus size={24} />
    },

    {
        path: 'create-genre',
        text: 'Tạo thể loại mới',
        icon: <FaIcons size={24} />
    },

    {
        path: 'create-album',
        text: 'Tạo album mới',
        icon: <RiPlayListAddFill size={24} />
    },

    {
        path: 'create-song',
        text: 'Tạo bài hát mới',
        icon: <TbMusicPlus size={24} />
    },

]