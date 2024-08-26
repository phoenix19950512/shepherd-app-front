import { Text } from '@chakra-ui/react';
import React, { FC } from 'react';

interface SectionProps {
  title: string;
  subtitle?: any;
  description: string;
}

const Section: FC<SectionProps> = ({ title, subtitle, description }) => {
  return (
    <section className="my-4">
      <Text className="space-x-2">
        <span className="font-bold text-2xl">{title}</span>
        {subtitle && (
          <span className="inline-block text-sm bg-gray-100 px-2 py-1 rounded-md text-primaryGray">
            {subtitle}
          </span>
        )}
      </Text>
      <Text className="text-primaryGray">{description}</Text>
    </section>
  );
};

export default Section;
