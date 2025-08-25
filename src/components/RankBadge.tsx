import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Gem, Crown } from 'lucide-react';

type RankTier = 'silver' | 'gold' | 'diamond' | 'master';

interface RankBadgeProps {
  tier: RankTier;
  points: number;
  size?: 'sm' | 'md' | 'lg';
}

const rankConfig = {
  silver: {
    label: 'Bạc',
    icon: Award,
    className: 'bg-rank-silver text-white',
    range: '< 1100 điểm'
  },
  gold: {
    label: 'Vàng',
    icon: Trophy,
    className: 'bg-rank-gold text-white',
    range: '1100-1299 điểm'
  },
  diamond: {
    label: 'Kim cương',
    icon: Gem,
    className: 'bg-rank-diamond text-white',
    range: '1300-1499 điểm'
  },
  master: {
    label: 'Cao thủ',
    icon: Crown,
    className: 'bg-rank-master text-white',
    range: '1500+ điểm'
  }
};

export function RankBadge({ tier, points, size = 'md' }: RankBadgeProps) {
  const config = rankConfig[tier];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1 font-semibold`}
      title={`${config.label} - ${config.range}`}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
      <span className="ml-1 opacity-90">({points})</span>
    </Badge>
  );
}