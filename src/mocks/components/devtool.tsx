import { ChevronDownIcon, SettingsIcon } from 'lucide-react';
import { IconButton } from '@/components/icon-button';
import { Sheet } from '@/components/sheet';
import { Switch } from '@/components/switch';
import { Tag } from '@/components/tag';
import { mockHandlers } from '../handlers';
import { type MockHandler, matchHandler } from '../utils';
import { useMSWProviderContext } from './msw-provider';

export const MSWDevtool = () => {
  return (
    <Sheet>
      <Sheet.Trigger
        render={
          <IconButton
            aria-label="열기"
            className="fixed right-4 bottom-4 rounded-full"
            size="small"
            variant="primary"
          >
            <SettingsIcon className="size-4.5" />
          </IconButton>
        }
      />
      <Sheet.Content className="w-[30rem]">
        <Sheet.Header>
          <Sheet.Title>MSW 설정</Sheet.Title>
          <Sheet.Description>
            MSW 핸들러를 활성화/비활성화할 수 있습니다.
          </Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <div className="mt-2 flex flex-col gap-6">
            {mockHandlers.map((handlerGroup, index) => (
              <div className="flex flex-col" key={index}>
                <span className="mb-2 font-medium text-subtle text-xs">
                  {handlerGroup.baseUrl.slice(1).toUpperCase()}
                </span>
                <ul className="flex flex-col gap-3">
                  {handlerGroup.handlers.map((handler, index) => (
                    <ApiEndpoint handler={handler} key={index} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet>
  );
};

type ApiEndpointProps = {
  handler: MockHandler;
};

const ApiEndpoint = ({ handler }: ApiEndpointProps) => {
  const { handlerConfig, toggleHandlerEnabled, changePreset } =
    useMSWProviderContext();

  const isEnabled = handlerConfig.enabledHandlers.some((enabledHander) =>
    matchHandler(enabledHander, handler)
  );

  const currentPreset =
    handlerConfig.enabledHandlers.find((h) => matchHandler(h, handler))
      ?.preset ?? handler.presets[0].label;

  const onPresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPreset = handler.presets.find(
      (p) => p.label === e.target.value
    );

    if (selectedPreset) {
      changePreset({
        method: handler.method,
        path: handler.path,
        preset: selectedPreset.label,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-2">
        <Tag>{handler.method}</Tag>
        <div className="flex gap-0.5">
          {handler.path.split('/').map((part, index) => (
            <div
              className="flex items-center gap-0.5 font-medium text-sm"
              key={index}
            >
              {part.startsWith(':') ? (
                <span className="flex h-5 items-center justify-center rounded-[0.375rem] bg-background-100 px-1.5">
                  {part.slice(1)}
                </span>
              ) : (
                <span className="text-main">{part}</span>
              )}
              {index < handler.path.split('/').length - 1 && (
                <span className="text-subtle">/</span>
              )}
            </div>
          ))}
        </div>
      </div>
      {isEnabled && (
        <div className="relative">
          <select
            className="focus-visible:focus-ring flex h-6 max-w-[6rem] cursor-pointer appearance-none items-center justify-center truncate rounded-[0.375rem] bg-background-100 px-2 pr-6.5 font-medium text-xs outline-hidden transition-colors hover:bg-background-200"
            onChange={onPresetChange}
            value={currentPreset}
          >
            {handler.presets.map((preset) => (
              <option key={preset.label} value={preset.label}>
                {preset.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 size-3.5" />
        </div>
      )}
      <Switch
        checked={isEnabled}
        onChange={() => toggleHandlerEnabled(handler)}
      />
    </div>
  );
};
