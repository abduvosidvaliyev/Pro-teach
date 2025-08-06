import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getDatabase,
    ref,
    onValue,
    set,
    update,
    get,
    remove
} from "firebase/database";
import { useEffect, useState } from "react";

const database = getDatabase()

const Title = () => {

    const UserData = JSON.parse(localStorage.getItem("userData"))
    const [CompanyInfo, setCompanyInfo] = useState([])
    const [Admins, setAdmins] = useState([])

    useEffect(() => {
        const systemRef = ref(database, 'System/CompanyInfo');
        onValue(systemRef, (snapshot) => {
            const data = snapshot.val()

            setCompanyInfo(Object.values(data || {}));
        })

        const adminRef = ref(database, "Admins")
        onValue(adminRef, (snapshot) => {
            const data = snapshot.val()
            setAdmins(Object.values(data || {}))
        })
    }, [])

    console.log(CompanyInfo);

    useEffect(() => {
        let info = !UserData ? "Register" : Admins.find(item => item.login === UserData?.login && item.parol === UserData?.parol) ? "Admin Panel" : "Student Panel"

        if (CompanyInfo) {
            document.title = CompanyInfo[2] ? `${CompanyInfo[2]} - ${info}` : info
        }
    }, [CompanyInfo, Admins, UserData])

    return null
}

export default Title