import { FaXmark } from 'react-icons/fa6';
import { cn } from '../utils/cn';

interface IBadgeProps {
  title: string;
  onClick?: () => void;
}

const Badge = ({ title, onClick }: IBadgeProps) => {
  return (
    <div className={cn('flex h-8 items-center gap-1 rounded-lg bg-slate-200 px-4', { 'pr-1': onClick })}>
      {title}
      {onClick && (
        <div
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-slate-400 text-white transition-colors hover:bg-slate-500 focus:bg-slate-500"
          onClick={onClick}
        >
          <FaXmark size={15} />
        </div>
      )}
    </div>
  );
};

export default Badge;
