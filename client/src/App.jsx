import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./Layout/MainLayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import DashBoard from "./pages/admin/DashBoard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroSection />
              <Courses/>
            </>
          ),
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path:"my-learning",
          element:<MyLearning/>
        },
        {
          path:"profile",
          element:<Profile/>
        },
        //admin paths
        {
          path:"admin",
          element:<Sidebar/>,
          children:[
            {
              path:"dashboard",
              element:<DashBoard/>
            },
            {
              path:"course",
              element:<CourseTable/>
            },
            {
              path:"course/create",
              element:<AddCourse/>
            },
            {
              path:"course/:courseId",
              element:<EditCourse/>
            },
            {
              path:"course/:courseId/lecture",
              element:<CreateLecture/>
              
              
            }
           

          ]
        }
      ],
    },
  ]);

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
