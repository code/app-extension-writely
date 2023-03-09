import { Switch, Tooltip } from 'antd';
import {
  MdiClose,
  MaterialSymbolsKeyboardBackspace,
  DashiconsAdminGeneric,
  RiHeartFill,
} from '@/components/icon';
import { ReactNode } from 'react';
import { useView } from '../../store/view';
import i18next from 'i18next';
import { useResultPanel } from '../../store/result-panel';
import type { MessagePayload } from '@/common/types';

export const Header: React.FC = () => {
  const { hide, goToInputPage } = useView();
  const { isOriginText, setIsOriginText } = useResultPanel();

  return (
    <div className="flex px-2 items-center bg-zinc-900 cursor-move handle justify-between">
      <div className="flex items-center">
        <Operation
          icon={<MaterialSymbolsKeyboardBackspace />}
          tooltip="Back"
          onClick={goToInputPage}
        />
        <Operation icon={<MdiClose />} tooltip="Close window" onClick={hide} />
      </div>
      <div className="flex items-center">
        <Tooltip title={i18next.t('Display original text')}>
          <Switch
            title={i18next.t('Text')}
            checked={!!isOriginText}
            onChange={(e) => setIsOriginText(e)}
            className={isOriginText ? '!bg-amber-800' : '!bg-gray-400'}
          />
        </Tooltip>
        <Operation
          icon={
            <a href="https://github.com/anc95/writely" target="_blank">
              <RiHeartFill className="text-orange-600" />
            </a>
          }
          tooltip={i18next.t('Love')}
        />
        <Operation
          onClick={() => {
            chrome.runtime.sendMessage<MessagePayload>({
              type: 'open-options-page'
            })
          }}
          icon={<DashiconsAdminGeneric />}
          tooltip="Jump to settings"
        />
      </div>
    </div>
  );
};

const Operation: React.FC<{
  icon: ReactNode;
  tooltip: string;
  onClick?: () => void;
}> = ({ icon, tooltip, onClick }) => {
  return (
    <Tooltip title={tooltip}>
      <div
        onClick={() => onClick?.()}
        className="text-white p-3 text-base flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-all duration-700"
      >
        {icon}
      </div>
    </Tooltip>
  );
};
