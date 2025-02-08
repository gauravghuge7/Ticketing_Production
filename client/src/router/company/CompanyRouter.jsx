import { Route, Routes } from "react-router-dom";
import CompanyDashboard from "../../company/CompanyDashboard/CompanyDashboard";
import CompanyLayout from "./CompanyLayout";
import TaskProjectList from "../../company/task/TaskProjectList";
import TaskList from "../../company/task/Tasklist";
import ProjectList from "../../company/project/Projectlist";
import Watch from "../../company/dashboard/Dashboardcontain";

const CompanyRouter = () => {
    return (
        <Routes > 

            <Route path="/" element={<CompanyLayout />}>

                <Route path="/" element={<Watch />} />
                <Route path="/dashboard" element={<Watch />} />


                <Route path="/CompanyTasks" element={<TaskProjectList />} />

                <Route path="/task" element={<TaskList />} />

                <Route path="/project" element={<ProjectList />} />
            
            </Route>


    
        </Routes>
    )
}
export default CompanyRouter;