import { Button } from '@lib/ui/index';
import { buttonStyles, outerDivStyles } from '../styles/headerButtonsStyles';
import SwitchUser from './SwitchUser';

type Props = {
  userEmail: string;
  LogOutComponent: React.ReactElement;
};

function HeaderButtons({ userEmail, LogOutComponent }: Props) {
  return (
    <div style={outerDivStyles}>
      {/* The string passed to isDisabled is shown as a tooltip */}
      <Button isDisabled={'Current logged in user'} kind="outlined" style={buttonStyles}>
        {userEmail}
      </Button>
      <SwitchUser />
      {LogOutComponent}
    </div>
  );
}

export default HeaderButtons;
