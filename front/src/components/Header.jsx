import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const location = useLocation();

    return (
        <header className="header">
            <div className="header-container">
                <h1 className="header-title">Sistema de Reservas de Laboratórios</h1>
                <nav className="header-nav">
                    <Link
                        to="/"
                        className={`header-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/reservas"
                        className={`header-link ${location.pathname === '/reservas' ? 'active' : ''}`}
                    >
                        Gerenciar Reservas
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;