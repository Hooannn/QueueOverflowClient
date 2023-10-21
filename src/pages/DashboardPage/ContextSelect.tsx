import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { RocketIcon, SunIcon, LightningBoltIcon, GlobeIcon } from '@radix-ui/react-icons';
import { RootState } from '../../@core/store';
import { DashboardContext, setDashboardContext } from '../../slices/app.slice';
export function ContextSelect() {
  const OPTIONS = [
    {
      value: 'best',
      label: (
        <div className="flex gap-2 items-center">
          <RocketIcon />
          Best
        </div>
      ),
    },
    {
      value: 'hot',
      label: (
        <div className="flex gap-2 items-center">
          <SunIcon />
          Hot
        </div>
      ),
    },
    {
      value: 'new',
      label: (
        <div className="flex gap-2 items-center">
          <LightningBoltIcon />
          New
        </div>
      ),
    },
    {
      value: 'top',
      label: (
        <div className="flex gap-2 items-center">
          <GlobeIcon />
          Top
        </div>
      ),
    },
  ];

  const dashboardContext = useSelector((state: RootState) => state.app.dashboardContext);
  const dispatch = useDispatch();

  const onContextChange = (value: DashboardContext) => {
    dispatch(setDashboardContext(value));
  };

  return (
    <Select value={dashboardContext} onValueChange={onContextChange}>
      <SelectTrigger className="w-[160px] h-12">
        <SelectValue placeholder="Select a context" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
