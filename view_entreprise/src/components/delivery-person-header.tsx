'use client';

import { useState } from 'react';
import { MapPin, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DeliveryPersonHeaderProps {
  name?: string;
  role?: string;
  location?: string;
  initialStatus?: 'available' | 'offline';
  onStatusChange?: (status: 'available' | 'offline') => void;
  className?: string;
}

export function DeliveryPersonHeader({
  name = 'Mamadou Diallo',
  role = 'Livreur',
  location = 'Plateau, Dakar',
  initialStatus = 'available',
  onStatusChange,
  className,
}: DeliveryPersonHeaderProps) {
  const [status, setStatus] = useState<'available' | 'offline'>(initialStatus);

  const handleStatusChange = (newStatus: 'available' | 'offline') => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 lg:px-6',
        className
      )}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
        <Truck className="h-5 w-5 text-primary" />
      </div>

      {/* Content - Name, Location and Badge */}
      <div className="flex-1 min-w-0">
        {/* First Line - Name and Badge */}
        <div className="flex items-center justify-between gap-3 mb-1">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{name}</h1>
            {role && (
              <p className="text-xs text-muted-foreground">{role}</p>
            )}
          </div>
          <Badge
            onClick={() => handleStatusChange(status === 'available' ? 'offline' : 'available')}
            variant={status === 'available' ? 'default' : 'secondary'}
            className={cn(
              'text-xs font-medium cursor-pointer transition-all flex-shrink-0',
              status === 'available'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            )}
          >
            {status === 'available' ? 'Disponible' : 'Hors ligne'}
          </Badge>
        </div>

        {/* Second Line - Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}
