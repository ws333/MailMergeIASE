import GoogleLogOut from './GoogleLogOut';

type Props = {
  userEmail: string;
};

function GoogleLoggedInAs({ userEmail }: Props) {
  return (
    <div className="columnRight">
      {
        <div className="logged-in-info">
          Logged in as {userEmail} <GoogleLogOut />
        </div>
      }
    </div>
  );
}

export default GoogleLoggedInAs;
