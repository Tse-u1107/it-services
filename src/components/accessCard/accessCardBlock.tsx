import { AccessCard } from './accessCard';
import { type Item } from '../expandableList/interface';

const AccessCardBlock = ({ accessItems }: {accessItems: Item[]}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="">Quick Access</div>
        <div>Browse all topics</div>
      </div>
      <div>
        <div className="flex flex-wrap justify-center">
          {accessItems.map((item, index) => (
            <AccessCard
              key={item.id}
              title={item.title}
              content={item.content}
              icon={item.icon}
              id={'access_' + String(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessCardBlock
