import { React, useState } from 'react'

const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
  
    const dropdownItems = [
      'Item 1',
      'Item 2',
      'Item 3',
      // Thêm các mục khác nếu cần
    ];
  
    const filteredItems = dropdownItems.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleItemClick = (item) => {
      setSelectedItem(item);
      setIsOpen(false);
    };
  
    return (
      <div className="relative inline-block text-left">
        <div>
          <button
            onClick={toggleDropdown}
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
          >
            {selectedItem || 'Select an item'}
            {/* Icon dropdown ở đây */}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
  
        {/* Dropdown menu */}
        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
                <a
                  key={item}
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
}

export default Dropdown