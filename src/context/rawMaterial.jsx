


// context/rawMaterial.js
import { createContext, useState } from 'react';

const RawMaterialContext = createContext();

const RawMaterialProvider = ({ children }) => {
  const [changePage, setChangePage] = useState("initial");
  const [trackingId, setTrackingId] = useState(null);
  const [stockRef, setStockRef] = useState(null);
  const [stock, setStock] = useState({});

  return (
    <RawMaterialContext.Provider value={{stock,setStock,stockRef,setStockRef, trackingId,setTrackingId, changePage, setChangePage }}>
      {children}
    </RawMaterialContext.Provider>
  );
};

export { RawMaterialProvider, RawMaterialContext };
