import icons from "./icons"

const { MdOutlineLibraryMusic,
    MdOutlineFeed,
    BsDisc,
    TbChartArcs,
} = icons;

export const sidebarMenu = [
    {
        path: '',
        text: 'Khám phá',
        end: true,
        icon: <BsDisc size={22} />
    },

    {
        path: 'zingchart',
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

]