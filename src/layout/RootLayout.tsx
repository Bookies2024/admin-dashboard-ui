import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";

const RootLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: '16vw', p: 2  }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default RootLayout;
