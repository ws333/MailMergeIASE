import { AccountInfo } from '@azure/msal-browser';
import LogIn from './LogIn';
import LogOut from './LogOut';

type Props = {
  accounts: AccountInfo[];
};

function EmailSenderInfo({ accounts }: Props) {
  return (
    <div className="columnRight">
      {accounts.length === 0 ? (
        <LogIn />
      ) : (
        <div className="logged-in-info">
          Logged in as {accounts[0].username} <LogOut />
        </div>
      )}
    </div>
  );
}

export default EmailSenderInfo;
