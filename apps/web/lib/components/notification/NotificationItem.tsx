import { Avatar, AvatarImage, Text } from 'ui';

export function NotificationItem() {
  return (
    <div className="border-b-2 py-1">
      <div className="flex items-center px-4 py-3">
        <Avatar>
          <AvatarImage src="https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg" />
        </Avatar>
        <div className="pl-2">
          <Text variant="sm-medium">User edited Admission Form recently</Text>
          <Text variant="xs-regular" className="text-gray-800">
            36 mins ago
          </Text>
        </div>
      </div>
    </div>
  );
}
