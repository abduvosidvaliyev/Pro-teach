import { onValueData } from "../../FirebaseData";

import { useEffect, useState } from "react";

const Title = () => {

    const UserData = JSON.parse(localStorage.getItem("userData"))
    const [CompanyInfo, setCompanyInfo] = useState([])
    const [Admins, setAdmins] = useState([])

    useEffect(() => {
        onValueData('System/CompanyInfo', (data) => {
            setCompanyInfo(Object.values(data || {}));
        })

        onValueData("Admins", (data) => {
            setAdmins(Object.values(data || {}))
        })
    }, [])

    useEffect(() => {
        const defaultAppName = "Pro-Teach";
        let info;

        if (!UserData) {
            info = "Register";
        } else if (Admins.length === 0) {
            // Adminlar hali yuklanmagan paytda default nomni ko'rsatish
            info = defaultAppName;
        } else {
            const isAdmin = Admins.find(item => item.login === UserData?.login && item.parol === UserData?.parol);
            info = isAdmin ? "Admin Panel" : "Student Panel";
        }

        const appName = CompanyInfo?.[2] || null;
        document.title = appName ? `${appName} - ${info}` : info;
    }, [CompanyInfo, Admins, UserData])

    return null
}

export default Title