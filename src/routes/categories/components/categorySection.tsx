import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { type CategoryItem } from '../interface';

const CategorySection = ({ 
  title = "Account & access", 
  icon: Icon = QuestionMarkCircleIcon,
  items = []
}: {
    title: string,
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
    items: CategoryItem[]
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index}>
            <a 
              href={item.link} 
              className="text-gray-700 hover:text-purple-700 hover:underline text-sm transition-colors"
            >
              {item.linkTitle}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySection