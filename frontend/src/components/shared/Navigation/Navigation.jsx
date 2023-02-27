import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const { auth, user } = useSelector((state) => state.auth);
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };

  const logoText = {
    marginLeft: "10px",
  };

  const logoutUser = async () => {
    try {
      await logout();
      await dispatch(setAuth({ logout: true }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyle} to="/">
        <img src="/images/logo.png" alt="logo" />
        <span style={logoText}>Codershouse</span>
      </Link>
      {auth?<div className={styles.navRight}>
        <h3>{user.name?user.name:""}</h3>
        <Link to="/" className={styles.navLink}>
          <img className={styles.avatar} src={user.avatar ? user.avatar: "./images/monkey-avatar.png"} width="40" height="40" alt="avatar"/>

        </Link>
        <button onClick={logoutUser} className={styles.logout} >
          <img src="/images/logout.png" alt="logout" />
        </button>
      </div>:""}
    </nav>
  );
};

export default Navigation;
