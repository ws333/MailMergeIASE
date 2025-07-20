import { AccountInfo } from '@azure/msal-browser';
import MSLogOut from './MSLogOut';

type Props = {
  accounts: AccountInfo[];
};

function MSLoggedInAs({ accounts }: Props) {
  return (
    <div className="columnRight">
      {
        <div className="logged-in-info">
          Logged in as {accounts[0].username} <MSLogOut />
        </div>
      }
    </div>
  );
}

export default MSLoggedInAs;
