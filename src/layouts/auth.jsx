
import { Routes, Route } from "react-router-dom";
import routes from "../Routes/routes";


const  Auth=()=> {
  return (
    <div className="min-h-screen w-full">
      
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "auth" &&
              pages.map(({ path, element }) => {
                return <Route key={path} exact path={path} element={element} />;
              })
          )}
        </Routes>
    
    </div>
  );
}



export default Auth;
