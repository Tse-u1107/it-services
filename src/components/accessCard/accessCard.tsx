import { PlusIcon } from "@heroicons/react/24/outline";

export const AccessCard = ({
  title,
  content,
  icon,
  id,
}: {
  title: string;
  content: string;
  icon: React.ReactNode;
  id: string;
}) => {
  return (
    <div id={id} className="bg-white m-2 p-8 rounded-3xl w-1/4 relative min-h-[280px]">
      <div className="absolute top-8 left-8">{icon}</div>
      <div className="w-full mt-20 text-2xl font-semibold text-gray-900">{title}</div>
      <div className="w-full mt-4 text-base text-gray-500 leading-relaxed">{content}</div>
      <div className="absolute bottom-8 right-8">
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
          <PlusIcon className="icon-8 text-white stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
