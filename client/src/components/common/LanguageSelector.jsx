import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
    const { language, changeLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2">
            <Globe size={20} className="text-gray-600" />
            <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent border-none text-gray-700 font-medium cursor-pointer focus:outline-none"
                style={{ appearance: 'none', WebkitAppearance: 'none' }}
            >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
