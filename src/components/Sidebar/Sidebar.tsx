import "./Sidebar.css"
import { Key, Home, LockKeyhole, Star, ShieldCheck, Wand2, Trash2 } from "lucide-react";

function Sidebar() {
    return (
        <>
            <div className="sidebar-container">
                <div className="sidebar-header-container">
                    <div className="sidebar-header-logo-container">
                        <Key className="sidebar-header-logo" />
                    </div>
                    <h1 className="sidebar-header-title">PasswordPrison</h1>
                </div>

                <div className="sidebar-divider">
                    <span className="sidebar-divider-title">HOME</span>
                </div>

                <div className="sidebar-item">
                    <Home className="sidebar-item-icon" />
                    <span className="sidebar-item-title">Home</span>
                </div>
                <div className="sidebar-item">
                    <LockKeyhole className="sidebar-item-icon" />
                    <span className="sidebar-item-title">All Passwords</span>
                </div>
                <div className="sidebar-item">
                    <Star className="sidebar-item-icon" />
                    <span className="sidebar-item-title">Favourites</span>
                </div>

                <div className="sidebar-divider">
                    <span className="sidebar-divider-title">Security</span>
                </div>

                <div className="sidebar-item">
                    <ShieldCheck className="sidebar-item-icon" />
                    <span className="sidebar-item-title">Security</span>
                </div>
                <div className="sidebar-item">
                    <Wand2 className="sidebar-item-icon" />
                    <span className="sidebar-item-title">Password Generator</span>
                </div>

                <div className="sidebar-divider">
                    <span className="sidebar-divider-title">Trash</span>
                </div>
                
                <div className="sidebar-item">
                    <Trash2 className="sidebar-item-icon" />
                    <span className="sidebar-item-title">Trash</span>
                </div>
            </div>
        </>
    )
}

export { Sidebar }