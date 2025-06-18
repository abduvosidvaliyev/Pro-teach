import { Link } from "react-router-dom"
import style from "./App.module.css"
const BasicNavbar = () => {
    return (
        <aside className={style.basicAside}>
            <Link to="/">
                <i className={`fa-solid fa-house ${style.icon}`}></i>
            </Link>
            <i className={`fa-solid fa-layer-group ${style.icon}`}></i>
            <Link to="/studentchat">
                <i className={`fa-solid fa-message ${style.icon}`}></i>
            </Link>
        </aside>
    )
}

export default BasicNavbar