'use client'
import React, { useState } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';

type OptionType = {
    value: string;
    label: string;
};

const customStyles: StylesConfig<OptionType, false> = {
    control: (provided) => ({
        ...provided,
        backgroundColor: '#f0f0f0',
        borderColor: '#ccc',
        '&:hover': {
            borderColor: '#888'
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#e2e6ea' : '#fff',
        color: state.isSelected ? '#fff' : '#333',
        '&:hover': {
            backgroundColor: '#e2e6ea'
        }
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#333'
    })
};

const DropdownRadioComponent: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<SingleValue<OptionType>>(null);
    const [selectedRadio, setSelectedRadio] = useState<string>('');

    const handleDropdownChange = (option: SingleValue<OptionType>) => {
        setSelectedOption(option);
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRadio(e.target.value);
    };

    const options: OptionType[] = [
        { value: 'Residentials', label: 'Residentials' },
        { value: 'Villas', label: 'Villas' },
        { value: 'Offices', label: 'Offices' },
        { value: 'Commercial', label: 'Commercial' },
        { value: 'Others', label: 'Others' }
    ];

    return (
        <div className="flex flex-col md:flex-row justify-start mt-10 mb-5 space-y-4 md:space-y-0 md:space-x-10">
           <div className="w-full ml-10 md:w-1/6">
                <Select
                    id="dropdown"
                    value={selectedOption}
                    onChange={handleDropdownChange}
                    options={options}
                    styles={customStyles}
                    className="w-full"
                />
            </div>
            <div className="flex flex-row gap-4">
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="available"
                        name="radioGroup"
                        value="available"
                        checked={selectedRadio === 'available'}
                        onChange={handleRadioChange}
                        className="mr-2 accent-blue-500"
                    />
                    <label htmlFor="available" className="text-gray-700 text-lg font-serif dark:text-gray-300">Available</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="sold out"
                        name="radioGroup"
                        value="sold out"
                        checked={selectedRadio === 'sold out'}
                        onChange={handleRadioChange}
                        className="mr-2 accent-blue-500"
                    />
                    <label htmlFor="sold out" className="text-gray-700 text-lg font-serif dark:text-gray-300">Sold Out</label>
                </div>
            </div>
            
        </div>
    );
};

export default DropdownRadioComponent;
