import React, { useState }from "react";
import Header from "../../components/Dashboard/Header";
import Sidebar from "../../components/Dashboard/Sidebar";
import HeroSection from "../../components/Dashboard/HeroSection";
import MoodCheckIn from "../../components/Dashboard/MoodCheckIn";
import ActionButtons from "../../components/Dashboard/ActionButtons";

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div>
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div style={{padding: "20px"}} >
                <HeroSection />
                <MoodCheckIn />
                <ActionButtons />
            </div>
        </div>
    );
};
export default Dashboard;