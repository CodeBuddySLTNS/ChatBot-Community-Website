import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ContextData } from "../App";

// import react icons
import { BiSolidMegaphone } from "react-icons/bi";
import { FaUsersLine, FaServer } from "react-icons/fa6";
import { FaGlobeAmericas, FaUsers, FaCannabis, FaPager } from "react-icons/fa";

const Navbar = () => {
  const { active, setActive } = useContext(ContextData);

  return (
    <div className="navbar">
      <nav>
        <li className={active.sites && "navActive"}>
          <Link to="/feed">
            <FaGlobeAmericas className="navIcon" />
          </Link>
        </li>
        <li className={active.apis && "navActive"}>
          <Link to="/apis">
            <FaCannabis className="navIcon" />
          </Link>
        </li>
        <li className={active.announce && "navActive"}>
          <Link to="/">
            <BiSolidMegaphone className="navIcon" />
          </Link>
        </li>
        <li className={active.pages && "navActive"}>
          <Link to="/pages">
            <FaPager className="navIcon" />
          </Link>
        </li>
        <li className={active.about && "navActive"}>
          <Link to="/about">
            <FaUsers className="navIcon" />
          </Link>
        </li>
      </nav>
    </div>
  );
};

export default Navbar;
