import { PlusIcon } from '@heroicons/react/24/outline';
import { type Item } from '../expandableList/interface';

const AccessCardBlock = ({ accessItems }: { accessItems: Item[] }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-[39px]">
        <div className="font-medium text-[28px] leading-[100%]">Quick Access</div>
        <button className="font-medium text-base leading-[100%] text-[#686868] hover:text-black cursor-pointer">
          Browse all topics {'>'}
        </button>
      </div>

      <div className="flex flex-wrap gap-[56px]">
        {accessItems.map((item, index) => (
          <div
            key={item.id}
            id={'access_' + String(index)}
            className="bg-white p-6 rounded-[25px] w-[calc(33.333%-37.33px)] relative h-[230px]"
          >
            <div className="w-8 h-8 relative mb-4">{item.icon}</div>
            <div className="font-medium text-base leading-[128%] mb-4">{item.title}</div>
            <div className="font-normal text-base leading-[128%] w-full mt-4 text-[#7e7e7e]">
              {item.content}
            </div>
            <div className="absolute bottom-6 right-6">
              <button className="bg-black rounded-full flex items-center justify-center cursor-pointer w-8 h-8">
                <PlusIcon className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessCardBlock;
