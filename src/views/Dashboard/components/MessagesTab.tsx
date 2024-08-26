import { Avatar, Text } from '@chakra-ui/react';

export default function MessagesTab() {
  return (
    <div className="flex space-x-3 py-3">
      <span className="inline-block h-fit relative">
        <Avatar
          name="Leslie"
          src="https://bit.ly/tioluwani-kolawole"
          bgColor="#4CAF50"
        />
      </span>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <Text fontWeight={500} fontSize={14} color="text.200">
            Leslie Peters Mapu
          </Text>
          <Text className="text-sm text-secondaryBlue">5m</Text>
        </div>
        <Text className="text-xs text-justify text-gray-500">
          Parturient amet sociis tempor integer enim hollup turoti posuere odio.
          Nunc habitant sit a arcu
        </Text>
      </div>
    </div>
  );
}
