import { useState, useEffect } from "react";
import api from "../http/index";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
export function useLoadingWithRefresh() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/refresh");
        dispatch(setAuth(data));
        setLoading(false);
      } catch (err) {
        // console.log(err);
        setLoading(false);
      }
    })();
    //linting fix below, idk how to use dispatch in dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading };
}
