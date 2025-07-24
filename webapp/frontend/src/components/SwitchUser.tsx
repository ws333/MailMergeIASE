import { Button } from '@lib/ui/index';
import { useNavigate } from 'react-router-dom';

const SwitchUser = () => {
  const navigate = useNavigate();

  const onClickSwitchUser = () => {
    void navigate('/', { replace: true });
  };

  return <Button onClick={onClickSwitchUser}>Switch user</Button>;
};

export default SwitchUser;
