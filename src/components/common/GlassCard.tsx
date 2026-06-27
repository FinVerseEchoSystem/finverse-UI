import React from 'react';
import { Card, CardContent, SxProps, Theme } from '@mui/material';

interface GlassCardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  padded?: boolean;
  sx?: SxProps<Theme>;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverable = false,
  padded = true,
  sx = {},
  className = '',
  onClick,
}) => {
  return (
    <Card
      className={`${hoverable ? 'glass-panel-hover' : ''} ${className}`}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(6, 182, 212, 0.3)'
                  : 'rgba(79, 70, 229, 0.3)',
            }
          : {},
        ...sx,
      }}
    >
      {padded ? (
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          {children}
        </CardContent>
      ) : (
        children
      )}
    </Card>
  );
};

export default GlassCard;
