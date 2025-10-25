import { PlusIcon } from "@heroicons/react/24/outline";
import { type Item } from '../expandableList/interface';
import './accessCardBlock.css'

const AccessCardBlock = ({ accessItems }: {accessItems: Item[]}) => {
  return (
    <div className="access-card-block-wrapper">
      <div className="access-navigation">
        <div className="access-navigation-left">
          Quick Access
        </div>
        <button className="access-navigation-right">
          Browse all topics {">"}
        </button>
      </div>
      <div className="access-card-items-wrapper">
        {accessItems.map((item, index) => (
          <div 
            key={item.id}
            id={'access_' + String(index)} 
            className="access-card-item"
          >
            <div className="access-card-icon">{item.icon}</div>
            <div className="access-card-title">{item.title}</div>
            <div className="access-card-description">{item.content}</div>
            <div className="access-card-plus-container">
              <button className="access-card-plus">
                <PlusIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessCardBlock;