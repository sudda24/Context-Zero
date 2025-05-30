import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClickOutOfBounds, useUtils } from "../../hooks/utils";
import AddNewDropdown from "../AddNewDropdown/AddNewDropdown";
import TrashIcon from "../../icons/TrashIcon";
import classNames from "classnames";
import PhotoIcon from "../../icons/PhotoIcon";
// import SettingsIcon from "../../icons/SettingsIcon";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { closeDrawer } from "../../reducers/leftSection";
import SettingsIcon from "../../icons/SettingsIcon";
import ChevronSolid from "../../icons/ChevronSolid";
import HomeIconOutline from "../../icons/HomeIconOutline";
import { addNavigationMap } from "../../reducers/selected";
import SvgChart from "../../icons/Chart";
import SvgLogout from "../../icons/Logout";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { logoutAPI } from "../../api/userAPI";

const LeftSection = ({
  scrollDivRef,
}: {
  scrollDivRef: React.RefObject<HTMLDivElement>;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const leftSectionOpen = useAppSelector((state) => state.leftSection.drawOpen);
  const { isHome, isHomeFolder, isTrash, isMedia, isSettings } = useUtils();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const addNewDisabled = useRef(false);
  const closeDropdownDisabled = useRef(true);

  const openDropdown = () => {
    if (addNewDisabled.current) return;
    addNewDisabled.current = true;
    closeDropdownDisabled.current = true;
    setIsDropdownOpen(true);
    setTimeout(() => (closeDropdownDisabled.current = false), 300);
  };

  const closeDropdown = useCallback(() => {
    if (closeDropdownDisabled.current) return;
    addNewDisabled.current = true;
    closeDropdownDisabled.current = true;
    setIsDropdownOpen(false);

    // Clicking out of bounds on the add new button will cause it to reopen
    setTimeout(() => (addNewDisabled.current = false), 300);
  }, []);

  const goHome = () => {
    dispatch(closeDrawer());
    dispatch(
      addNavigationMap({
        url: window.location.pathname,
        scrollTop: scrollDivRef.current?.scrollTop || 0,
      })
    );
    navigate("/home");
  };

  const goTrash = () => {
    dispatch(closeDrawer());
    dispatch(
      addNavigationMap({
        url: window.location.pathname,
        scrollTop: scrollDivRef.current?.scrollTop || 0,
      })
    );
    navigate("/trash");
  };

  const goMedia = () => {
    dispatch(closeDrawer());
    dispatch(
      addNavigationMap({
        url: window.location.pathname,
        scrollTop: scrollDivRef.current?.scrollTop || 0,
      })
    );
    navigate("/media");
  };

  const goSettings = () => {
    dispatch(closeDrawer());
    dispatch(
      addNavigationMap({
        url: window.location.pathname,
        scrollTop: scrollDivRef.current?.scrollTop || 0,
      })
    );
    navigate("/settings");
  };

  const logoutClick = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure to logout?",
        text: "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#18181B",
        confirmButtonText: "Continue",
      });

      if (!result.value) return;

      await toast.promise(logoutAPI(), {
        pending: "Logging out...",
        success: "Logged out",
        error: "Error Logging Out",
      });

      window.localStorage.removeItem("hasPreviouslyLoggedIn");

      navigate("/");
    } catch (e) {
      console.log("Error logging out", e);
    }
  };

  const closeDrawerEvent = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!leftSectionOpen) return;

      const target = e.target as HTMLElement;

      const idsToIgnore = ["search-bar", "menu-icon", "header"];

      if (!target || idsToIgnore.includes(target.id)) {
        return;
      }

      dispatch(closeDrawer());
    },
    [leftSectionOpen]
  );

  const { wrapperRef } = useClickOutOfBounds(closeDrawerEvent, leftSectionOpen);

  return (
    <div
      ref={wrapperRef}
      className={classNames(
        "p-6 fixed desktopMode:relative border-r w-[270px] min-w-[270px] bg-white h-full z-20 desktopMode:z-0 animate-movement mt-14",
        {
          "-left-[270px] desktopMode:left-0": !leftSectionOpen,
          "left-0": leftSectionOpen,
        }
      )}
    >
      <div className="flex flex-col h-full select-none text-sm">
        <div>
          <div className="relative mb-7" style={{ isolation: 'isolate' }}>
            <button
              id="add-new-button"
              onClick={openDropdown}
              type="button"
              className="flex items-center justify-between w-full bg-primary hover:bg-primary-hover transition-colors duration-200 no-underline rounded-md px-4 py-3 shadow-md"
            >
              <p className="m-0 text-white font-semibold text-sm">
                ADD NEW
              </p>
              <ChevronSolid className={`text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />  
            </button>
            <AddNewDropdown
              closeDropdown={closeDropdown}
              isDropdownOpen={isDropdownOpen}
            />
          </div>
        </div>

        <div
          className={classNames(
            "pl-2 mr-5 py-2 hover:bg-white-hover rounded-md cursor-pointer animate flex flex-row items-center w-full",
            isHome || isHomeFolder
              ? "text-primary bg-white-hover"
              : "text-gray-primary"
          )}
          onClick={goHome}
        >
          <HomeIconOutline className="w-6 h-6" />
          <p className="ml-3">Home</p>
        </div>

        <div
          className={classNames(
            "pl-2 mr-5 py-2 hover:bg-white-hover rounded-md cursor-pointer animate flex flex-row items-center mt-1 w-full",
            isMedia ? "text-primary bg-white-hover" : "text-gray-primary"
          )}
          onClick={goMedia}
        >
          <PhotoIcon className="w-6 h-6" />
          <p className="ml-2.5">Media</p>
        </div>

        <div
          className={classNames(
            "pl-2 mr-5 py-2 hover:bg-white-hover rounded-md cursor-pointer animate flex flex-row items-center desktopMode:hidden mt-1 w-full",
            isSettings ? "text-primary bg-white-hover" : "text-gray-primary"
          )}
          onClick={goSettings}
        >
          <SettingsIcon className="w-6 h-6" />
          <p className="ml-2.5">Settings</p>
        </div>

        <div
          className={classNames(
            "pl-2 mr-5 py-2 hover:bg-white-hover rounded-md cursor-pointer animate flex flex-row items-center mt-1 w-full",
            isTrash ? "text-red-500 bg-white-hover" : "text-gray-primary"
          )}
          onClick={goTrash}
        >
          <TrashIcon className="w-6 h-6" />
          <p className="ml-2.5">Trash</p>
        </div>

        <button 
        onClick={logoutClick}
          className={classNames(
            "pl-2 mr-5 py-2 hover:bg-white-hover rounded-md cursor-pointer animate flex flex-row items-center w-full",
            isHome || isHomeFolder
              ? "text-gray-primary"
              : "text-gray-primary"
          )}
        >
          <SvgLogout className="w-6 h-6" />
          <p className="ml-3">Logout</p>
        </button>

      </div>
    </div>
  );
};

export default LeftSection;
