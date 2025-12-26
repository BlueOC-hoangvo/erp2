import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined);

const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu');
  }
  return context;
};

interface DropdownMenuProps {
  children: ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ asChild, children }) => {
  const { open, setOpen } = useDropdownMenu();

  const handleClick = () => {
    setOpen(!open);
  };

  if (asChild) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
};

interface DropdownMenuContentProps {
  align?: 'start' | 'center' | 'end';
  children: ReactNode;
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ align = 'center', children }) => {
  const { open, setOpen } = useDropdownMenu();

  if (!open) return null;

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'absolute z-20 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5',
          alignmentClasses[align]
        )}
      >
        <div
          className="py-1"
          role="menu"
          aria-orientation="vertical"
        >
          {children}
        </div>
      </div>
    </>
  );
};

interface DropdownMenuItemProps {
  onClick?: () => void;
  children: ReactNode;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ onClick, children }) => {
  const { setOpen } = useDropdownMenu();

  const handleClick = () => {
    onClick?.();
    setOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
      role="menuitem"
    >
      {children}
    </button>
  );
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
