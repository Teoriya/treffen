import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import Avatar from "react-avatar";

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
        <img src="/images/logo-with-name.png" alt="logo" className={styles.logoicon}/>
      </Link>
      {auth?<div className={styles.navRight}>
        <h3>{user.name?user.name:""}</h3>
        <Link to="/" className={styles.navLink}>
          {
            user.avatar?<img className={styles.avatar} src={user.avatar} width="40" height="40" alt="avatar"/>:<Avatar name={user.name} size="40px" round="20px"/>
          }
          

        </Link>
        <button onClick={logoutUser} className={styles.logout} >
          <img src="/images/logout.png" alt="logout" />
        </button>
      </div>:""}
    </nav>
  );
};

export default Navigation;
