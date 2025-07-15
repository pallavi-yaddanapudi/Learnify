import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import DarkMode from "@/pages/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };
  console.log(user);
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);
  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10 ">
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={30} />
          <h1 className="hidden md:block font-extrabold text-2xl">
            E-Learning
          </h1>
        </div>
        <div>
          <div className="flex items-center gap-8">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="h-10 w-10 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition">
                    <Avatar className="h-full w-full rounded-full">
                      <AvatarImage
                        src={user?.photoUrl || "https://github.com/shadcn.png"}
                        alt="@shadcn"
                        className="object-cover h-full w-full"
                      />
                      <AvatarFallback className="flex items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-700 text-sm font-semibold text-gray-800 dark:text-white">
                        CN
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] shadow-lg p-1"
                  align="start"
                >
                  <DropdownMenuLabel className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    My Account
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

                  <DropdownMenuGroup>
                    <DropdownMenuItem className="px-3 py-2 text-sm text-gray-700 dark:text-gray-100 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Link to="my-learning">My Learning</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-3 py-2 text-sm text-gray-700 dark:text-gray-100 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Link to="profile">Edit Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md cursor-pointer hover:bg-red-50 dark:hover:bg-red-900"
                      onClick={logoutHandler}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                  {user.role === "instuctor" && (
                    <>
                      <DropdownMenuItem className="px-3 py-2 text-sm text-gray-700 dark:text-gray-100 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                        Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Signup
                </Button>
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
              </div>
            )}
            <DarkMode />
          </div>
        </div>
      </div>
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-Learning</h1>
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const role = "instructor";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-gray-200 hover:bg-gray-300"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col justify-between p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mt-4">
          <SheetTitle className="text-lg font-semibold">E-Learning</SheetTitle>
          <DarkMode />
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex flex-col gap-4 text-base font-medium">
          <span className="hover:text-black-600 cursor-pointer">
            My Learning
          </span>
          <span className="hover:text-black-600 cursor-pointer">
            Edit Profile
          </span>
          <span className="hover:text-black-600 cursor-pointer">Log out</span>
        </nav>
        {role === "instructor" && (
          <SheetFooter className="mt-auto">
            <SheetClose asChild>
              <Button type="submit" className="w-full">
                DashBoard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
