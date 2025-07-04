import { IconButton } from "@/components/icon-button";
import { Sheet } from "@/components/sheet";
import { ChevronDownIcon, SearchIcon, SettingsIcon } from "lucide-react";
import { mockHandlers } from "../handlers";
import { matchHandler, MockHandler, MockPreset } from "../utils";
import { Switch } from "@/components/switch";
import { useMSWProviderContext } from "./msw-provider";
import { Tag } from "@/components/tag";

export const MSWDevtool = () => {
  return (
    <Sheet>
      <Sheet.Trigger
        render={
          <IconButton
            variant="outlined"
            className="fixed bottom-4 right-4"
            aria-label="열기"
          >
            <SettingsIcon className="size-5" />
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
          <div className="flex flex-col gap-6 mt-2">
            {mockHandlers.map((handlerGroup, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-subtle text-xs font-medium mb-2">
                  {handlerGroup.baseUrl.slice(1).toUpperCase()}
                </span>
                <ul className="flex flex-col gap-3">
                  {handlerGroup.handlers.map((handler, index) => (
                    <ApiEndpoint key={index} handler={handler} />
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

  const preset =
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
      <div className="flex items-center gap-2 flex-1">
        <Tag>{handler.method}</Tag>
        <div className="flex gap-0.5">
          {handler.path.split("/").map((part, index) => (
            <div
              key={index}
              className="font-medium text-sm flex items-center gap-0.5"
            >
              {part.startsWith(":") ? (
                <span className="bg-background-100 px-1.5 h-5 flex justify-center items-center rounded-[0.375rem]">
                  {part.slice(1)}
                </span>
              ) : (
                <span className="text-main">{part}</span>
              )}
              {index < handler.path.split("/").length - 1 && (
                <span className="text-subtle">/</span>
              )}
            </div>
          ))}
        </div>
      </div>
      {isEnabled && (
        <div className="relative">
          <select
            className="flex justify-center items-center h-6 bg-background-100 text-xs font-medium px-2 rounded-[0.375rem] appearance-none outline-hidden focus-visible:focus-ring cursor-pointer hover:bg-background-200 transition-colors pr-6.5 max-w-[6rem] truncate"
            value={preset}
            onChange={onPresetChange}
          >
            {handler.presets.map((preset) => (
              <option key={preset.label} value={preset.label}>
                {preset.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute top-1/2 -translate-y-1/2 right-2 size-3.5 pointer-events-none" />
        </div>
      )}
      <Switch
        checked={isEnabled}
        onChange={() => toggleHandlerEnabled(handler)}
      />
    </div>
  );
};
