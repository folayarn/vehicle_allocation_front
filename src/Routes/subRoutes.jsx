
import { Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
export const SubRoutes = ({ subNav }) => {
  return (
  
      <Routes>
        {subNav.map(({ sub_path, element }) => {
          return <Route key={sub_path} path={sub_path} element={element} />;
        })}
      </Routes>
 
  );
};

SubRoutes.propTypes = {
  subNav: PropTypes.arrayOf(PropTypes.object).isRequired,
};