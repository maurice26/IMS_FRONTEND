import { Box, Typography } from "@mui/material";
import { useInView } from "framer-motion";
import { useRef } from "react";
import CountUp from "react-countup";

const StatCounter = ({ end, prefix = "", suffix = "", label, color = "#8e24aa", duration = 2.5 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <Box ref={ref} textAlign="center" sx={{ py: 2 }}>
      <Typography
        variant="h2"
        fontWeight={800}
        sx={{
          background: `linear-gradient(135deg, ${color} 0%, #e91e63 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: -2,
        }}
      >
        {isInView ? (
          <CountUp end={end} duration={duration} prefix={prefix} suffix={suffix} separator="," />
        ) : (
          `${prefix}0${suffix}`
        )}
      </Typography>
      <Typography variant="body1" color="text.secondary" fontWeight={500} sx={{ mt: 1 }}>
        {label}
      </Typography>
    </Box>
  );
};

export default StatCounter;
