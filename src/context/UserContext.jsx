
import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchSingleUserThunk } from "../store/thunks/UserThunk";


const UserContext = createContext();

const UserProvider = ({ children }) => {
 const {user,loading} =useSelector(state=>state.userSlice)
 const dispatch=useDispatch()
  useEffect(() => {
    const id =sessionStorage.getItem("e")
    
dispatch(FetchSingleUserThunk(id))
   
  }, []);

 
  return (
    <UserContext.Provider value={{ user,loading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
