import React, { useState, useEffect} from "react";
import style from './Sidebar.module.css'
import { useNavigate, Link } from 'react-router-dom';

export function SidebarPanel() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", isCollapsed ? "80px" : "250px")
  }, [isCollapsed])

  return (
    <div className={`${style.sidebar} ${isCollapsed ? style.collapsed : ""}`}>
      <div className={style.sidebarHeader}>
        <h3 className={style.brand}>
          <i className="fas fa-anchor"></i>
          <span>MyApp</span>
        </h3>
        <div className={style.toggleBtn} onClick={toggleSidebar}>
          <i
            className={`fas ${
              isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
            } ${style.toggleIcon}`}
          ></i>
        </div>
      </div>
      <ul className={style.navLinks}>
        <li>
          <Link to="/panel" className={style.navItem}>
            <span className={style.navIcon}>
              <i className="fas fa-home"></i>
            </span>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/control" className={style.navItem}>
            <span className={style.navIcon}>
              <i className="fa-solid fa-sliders"></i>
            </span>
            <span>Boshqaruv</span>
          </Link>
        </li>
        <li>
          <Link to="/groups" className={style.navItem}>
            <span className={style.navIcon}>
              <i className="fas fa-users"></i>
            </span>
            <span>Guruhlar</span>
          </Link>
        </li>
        <li>
          <Link to="/students" className={style.navItem}>
            <span className={style.navIcon}>
              <i className="fas fa-user"></i>
            </span>
            <span>Talabalar</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className={style.navItem}>
            <span className={style.navIcon}>
              <i className="fa-solid fa-chart-line"></i>
            </span>
            <span>Dashboard</span>
          </Link>
        </li>
        <li
          className={`${style.dropdown} ${
            activeDropdown === 0 ? style.active : ""
          }`}
        >
          <a
            href="#"
            className={`${style.navItem} ${style.dropdownToggle}`}
            onClick={() => toggleDropdown(0)}
          >
            <div>
              <span className={style.navIcon}>
                <i className="fas fa-cogs"></i>
              </span>
              <span>Settings</span>
            </div>
            <i
              className={`fas ${
                activeDropdown === 0 ? "fa-chevron-down" : "fa-chevron-right"
              } ${style.dropdownIcon}`}
            ></i>
          </a>
          <ul className={style.dropdownMenu}>
            <li>
              <i class="fa-regular fa-gem"></i>
              <a href="#" className={style.dropdownItem}>
                Kurslar
              </a>
            </li>
            <li>
              <i class="fa-solid fa-table-cells-large"></i>
              <a href="#" className={style.dropdownItem}>
                Xonalar
              </a>
            </li>
            <li>
              <i class="fa-solid fa-user-group"></i>
              <a href="#" className={style.dropdownItem}>
                Xodimlar
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
