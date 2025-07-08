import UserRoleList from './_components/UserRoleList';
import { UserRoleListHeader } from './_components/UserRoleListHeader';

const UserRole = () => {
  return (
    <div>
      <UserRoleListHeader />
      <UserRoleList />
    </div>
  );
};

export default UserRole;
