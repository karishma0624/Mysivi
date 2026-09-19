import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-lavender-100 flex items-center justify-center text-brand-purple font-black text-2xl">
        404
      </div>
      <h1 className="text-2xl font-black text-ink">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-body max-w-md">
        The growth experiment or module you requested does not exist.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" size="md" icon={<Home className="w-4 h-4" />}>
            Return to Growth Lab Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
