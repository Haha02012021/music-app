import icons from "./icons"

const { MdOutlineLibraryMusic,
    MdOutlineFeed,
    BsDisc,
    TbChartArcs,
    PiMusicNotesPlus,
    TbIcons,
    FaRegStar,
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

]