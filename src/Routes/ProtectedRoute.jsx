
import {Navigate, useLocation} from 'react-router-dom'

// Dummy authentication check function


 const ProtectedRoute = ({ children}) => {
  const isAuthenticated = sessionStorage.getItem("token");
  const location = useLocation();

  if (!isAuthenticated || isAuthenticated=== undefined) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  return children;
      };
export default ProtectedRoute