import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

const PublicHeader = () => {
    const { t, language, changeLanguage } = useLanguage();

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            background: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}>
            <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                {t('app_name')}
            </Link>

            <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '2px solid var(--primary-green)',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'var(--primary-green)',
                    background: 'white'
                }}
            >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
            </select>
        </header>
    );
};

export default PublicHeader;
