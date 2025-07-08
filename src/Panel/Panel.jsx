import Dashboard from "../components/ui/Dashboard"

function Panel({ setUserData }) {
    return (
        <div>
            <div className='p-5 mx-auto'
                style={{
                    marginLeft: "var(--sidebar-width, 250px)",
                    width: "var(--sidebar-width), 100%",
                    transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
                }}>
                <Dashboard setUserData={setUserData} />
            </div>
        </div>
    );
}

export default Panel;

