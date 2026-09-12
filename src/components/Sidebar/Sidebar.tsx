import "./Sidebar.css"
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Key, Home, LockKeyhole, Star, ShieldCheck, Wand2, Trash2, PanelLeftClose, PanelLeftOpen } from "lucide-react";

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header-container">
                <button className="sidebar-logo-toggle" onClick={() => setCollapsed(!collapsed)}>
                    <Key className="sidebar-header-logo logo-icon" />
                    {collapsed
                        ? <PanelLeftOpen className="sidebar-header-logo toggle-icon" />
                        : <PanelLeftClose className="sidebar-header-logo toggle-icon" />
                    }
                </button>
                <h1 className="sidebar-header-title">PasswordPrison</h1>
            </div>

            <div className="sidebar-divider">
                <span className="sidebar-divider-title">HOME</span>
            </div>

            <NavLink to="/" className="sidebar-item">
                <Home className="sidebar-item-icon" />
                <span className="sidebar-item-title">Home</span>
            </NavLink>
            <NavLink to="/allItems" className="sidebar-item">
                <LockKeyhole className="sidebar-item-icon" />
                <span className="sidebar-item-title">All Passwords</span>
            </NavLink>
            <NavLink to="/favouriteItems" className="sidebar-item">
                <Star className="sidebar-item-icon" />
                <span className="sidebar-item-title">Favourites</span>
            </NavLink>

            <div className="sidebar-divider">
                <span className="sidebar-divider-title">Security</span>
            </div>
            <NavLink to="/security" className="sidebar-item">
                <ShieldCheck className="sidebar-item-icon" />
                <span className="sidebar-item-title">Security</span>
            </NavLink>
            <NavLink to="/generator" className="sidebar-item">
                <Wand2 className="sidebar-item-icon" />
                <span className="sidebar-item-title">Password Generator</span>
            </NavLink>

            <div className="sidebar-divider">
                <span className="sidebar-divider-title">Trash</span>
            </div>
            <NavLink to="/trashedItems" className="sidebar-item">
                <Trash2 className="sidebar-item-icon" />
                <span className="sidebar-item-title">Trash</span>
            </NavLink>
        </div>
    )
}
export { Sidebar }