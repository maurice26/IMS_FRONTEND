import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import CountUp from "react-countup";

const KpiCard = ({ icon: Icon, label, value, sub, color, trend, trendVal, prefix = "", suffix = "", enableCountUp = true }) => {
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, "")) || 0;

  return (
    <Card
      className="hover-lift"
      sx={{
        background: "rgba(20, 20, 30, 0.7)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 3,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${color}, transparent)`,
          opacity: 0.6,
        },
      }}
    >
      <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box
            sx={{
              bgcolor: `${color}18`,
              p: 1.5,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: `${color}28`,
                transform: "scale(1.1)",
              },
            }}
          >
            <Icon sx={{ color, fontSize: 28 }} />
          </Box>
          {trendVal !== undefined && (
            <Chip
              icon={trend === "up" ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
              label={trendVal}
              size="small"
              sx={{
                bgcolor: trend === "up" ? "rgba(76, 175, 80, 0.12)" : "rgba(244, 67, 54, 0.12)",
                color: trend === "up" ? "#4caf50" : "#f44336",
                fontWeight: 700,
                fontSize: 11,
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          )}
        </Box>

        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -1, mb: 0.5 }}>
          {enableCountUp && numericValue > 0 ? (
            <CountUp end={numericValue} duration={2} prefix={prefix} suffix={suffix} separator="," />
          ) : (
            `${prefix}${value}${suffix}`
          )}
        </Typography>

        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>

        {sub && (
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
