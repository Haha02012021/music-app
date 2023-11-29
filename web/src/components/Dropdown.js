import { React, useEffect, useState } from 'react';
import icons from '../utils/icons';

const { FaAngleDown, GoArrowLeft, GoArrowRight } = icons;

const Dropdown = ({setSongs, data, setSongPageId, pageId, lastPage, songNames, songIds}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState(songNames !== null ? songNames : []);
    const [selectedIds, setSelectedIds] = useState(songIds !== null ? songIds : []);
    const [searchTerm, setSearchTerm] = useState('');
    console.log(selectedItems);

    const filteredItems = data.filter((item) =>
        (item?.name ? item?.name : item?.title)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setSongs(selectedIds);
    }, [selectedIds])

    const handleItemClick = (item) => {
        if (selectedItems.includes(item?.name ? item?.name : item?.title)) {
            setSelectedItems(selectedItems.filter((selected) => selected !== (item?.name ? item?.name : item?.title)));
            setSelectedIds(selectedIds.filter((selected) => selected !== item?.id))
        } else {
            setSelectedItems([...selectedItems, (item?.name ? item?.name : item?.title)]);
            setSelectedIds([...selectedIds, item?.id])
        }
    };

    return (
        <div className={`relative inline-block text-left`}>
            <div>
                <button
                    onClick={toggleDropdown}
                    type="button"
                    className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 
                    bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:[#9431C6]"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                >
                    {selectedItems.length === 0
                        ? 'Danh sách'
                        : selectedItems.join(', ')}
                    {/* Icon dropdown ở đây */}
                    <FaAngleDown />
                </button>
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="h-[300px] origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-y-auto">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        {/* Search input */}
                        <input
                            type="text"
                            className="p-2 w-full border-b border-gray-300"
                            placeholder="Search..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {/* Filtered items */}
                        {filteredItems.map((item) => (
                            <div
                                key={item?.id}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                                onClick={() => handleItemClick(item)}
                            >
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedItems.includes(item?.name ? item?.name : item?.title)}
                                    readOnly
                                />
                                <span>{item?.name ? item?.name : item?.title}</span>
                            </div>
                        ))}
                        <div className='flex flex-row-reverse px-4 py-2 cursor-pointer'>
                            <div className='flex gap-2'>
                            {pageId > 1 && <GoArrowLeft onClick={() => setSongPageId(pageId - 1)}/>}
                            {pageId < lastPage - 1 && <GoArrowRight onClick={() => setSongPageId(pageId + 1)} />}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dropdown