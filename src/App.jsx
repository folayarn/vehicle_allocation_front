import { Routes, BrowserRouter, Route } from "react-router-dom";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";
import Auth from "./layouts/auth";
import PageNotFound from "./pages/404pages/pageNotFound";
import Dashboard from "./layouts/dashboard";
import MessageAlert from "./components/MessageAlert";



function App() {


  return (
    <> 
    
    <MessageAlert/>
   
     
      <BrowserRouter>
       
          <Routes>
            
            <Route
              path="/*"
              element={
                <PublicRoute>
                
                  <Auth/>
                
                </PublicRoute>
              }
            />
            
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
               
              <Dashboard/>
               
                </ProtectedRoute>
              }
            />
           
            <Route path="*" element={
             
              <PageNotFound/>
          
              } />
          </Routes>
        
      </BrowserRouter>


    </>
  );
}

export default App
