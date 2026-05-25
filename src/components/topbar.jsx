import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const pathNames = location.pathname.split("/").filter((x) => x);
    const bc = pathNames.map((name, index) => {
      const pathTo = `/${pathNames.slice(0, index + 1).join("/")}`;
      const label = name.charAt(0).toUpperCase() + name.slice(1);
      return { label, pathTo };
    });
    setBreadcrumbs(bc);
  }, [location.pathname]);

  const pathMap = {
    dashboard: "Dashboard",
    products: "Products",
    sales: "Sales",
    users: "Users",
  };

  return (
    <Box
      sx={{
        backgroundColor: "#7b1fa2",
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {pathMap[location.pathname.split("/")[1]] || "Dashboard"}
          </Typography>
          {breadcrumbs.length > 0 && (
            <Breadcrumbs>
              {breadcrumbs.map((bc, index) => (
                <Link
                  key={bc.pathTo}
                  underline="hover"
                  color="inherit"
                  onClick={() => navigate(bc.pathTo)}
                  sx={{ cursor: "pointer" }}
                >
                  {bc.label}
                </Link>
              ))}
            </Breadcrumbs>
          )}
        </Box>
        <Typography variant="body1">
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Topbar;
