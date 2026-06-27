import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GlassCard from './GlassCard';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  sparklineData?: number[];
  glowColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  sparklineData = [10, 15, 8, 12, 20, 16],
  glowColor,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const trendColor =
    trend === 'up'
      ? theme.palette.success.main
      : trend === 'down'
      ? theme.palette.error.main
      : theme.palette.text.secondary;

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const valRange = maxVal - minVal || 1;

  const width = 100;
  const height = 36;
  const padding = 2;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * (width - padding * 2) + padding;
      const y =
        height -
        ((val - minVal) / valRange) * (height - padding * 2) -
        padding;
      return `${x},${y}`;
    })
    .join(' ');

  const accentColor = glowColor || theme.palette.primary.main;

  return (
    <GlassCard
      hoverable
      padded={false}
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Colored top accent bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${accentColor}cc, ${accentColor}44)`,
          borderRadius: '16px 16px 0 0',
        }}
      />

      <Box sx={{ p: 2.5, pt: 3 }}>
        {/* Header: icon + title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', fontSize: '0.7rem' }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              p: 1,
              borderRadius: '10px',
              backgroundColor: `${accentColor}18`,
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${accentColor}28`,
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Big value */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            mb: 2,
            color: 'text.primary',
            fontSize: { xs: '1.25rem', sm: '1.4rem' },
          }}
        >
          {value}
        </Typography>

        {/* Footer: trend chip + sparkline */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            icon={<TrendIcon size={12} style={{ color: trendColor }} />}
            label={change}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 22,
              backgroundColor:
                trend === 'up'
                  ? 'rgba(16, 185, 129, 0.12)'
                  : trend === 'down'
                  ? 'rgba(239, 68, 68, 0.12)'
                  : `${isDark ? 'rgba(156,163,175,0.12)' : 'rgba(100,116,139,0.1)'}`,
              color: trendColor,
              border: `1px solid ${trendColor}30`,
              '& .MuiChip-label': { px: 0.75 },
              '& .MuiChip-icon': { ml: 0.5, mr: -0.25 },
            }}
          />

          <svg width={width} height={height} style={{ overflow: 'visible', opacity: 0.9 }}>
            <defs>
              <linearGradient id={`sg-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={trendColor} stopOpacity="0.35" />
                <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M ${padding},${height} L ${points} L ${width - padding},${height} Z`}
              fill={`url(#sg-${title.replace(/\s+/g, '')})`}
            />
            <polyline
              fill="none"
              stroke={trendColor}
              strokeWidth="2"
              points={points}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {sparklineData.length > 0 && (
              <circle
                cx={(sparklineData.length - 1) * ((width - padding * 2) / (sparklineData.length - 1)) + padding}
                cy={height - ((sparklineData[sparklineData.length - 1] - minVal) / valRange) * (height - padding * 2) - padding}
                r="3"
                fill={trendColor}
                style={{ filter: `drop-shadow(0 0 3px ${trendColor})` }}
              />
            )}
          </svg>
        </Box>
      </Box>
    </GlassCard>
  );
};

export default StatCard;
