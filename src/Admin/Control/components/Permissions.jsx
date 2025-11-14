import { useEffect, useState } from "react"
import { onValueData } from "../../../FirebaseData"

const Permissions = () => {
    const [Users, setUsers] = useState([])

    useEffect(() => {
        onValueData("Teachers", (data) => {
            setUsers(Object.values(data || {}))
        })
    }, [])

    // useEffect(() => {
    //     onValueData("Admin", (data) => {
    //         setUsers([ ...Users, data])
    //     })
    // }, [Users])


    return (
        <>
            <h1 className="text-3xl font-semibold">
                Foydalanuvchi Ruxsatlari
            </h1>
            <div className="flex flex-wrap gap-5">
                {
                    Users.map((user, index) => (
                        <div className="flex">
                            {user.name}
                        </div>
                    ))

                }
            </div>
        </>
    )
}

export default Permissions