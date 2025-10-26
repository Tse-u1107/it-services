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
    <div className="">
      <div className="flex items-center gap-2 mb-5 color-[#2B2B2B]">
        <Icon className="icon-5 text-gray-700" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index}>
            <a 
              href={item.link} 
              className="color-[#32013B] hover:text-purple-700 hover:underline text-sm"
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