import { RightArrowIcon } from '../../../../../../../../../../../components/icons';

const Button = ({
  disabled,
  onClick,
  title,
  ...props
}: {
  disabled: boolean;
  title?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className={`h-[28px] rounded-full bg-[#207DF7] flex gap-2 justify-center items-center transition-all px-2 whitespace-nowrap ${
        disabled ? 'cursor-not-allowed grayscale' : 'cursor-pointer'
      }`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span className="font-medium text-white text-[0.6rem] leading-[0px] md:leading-none sm:text-sm">
        {title}
      </span>
      <RightArrowIcon />
    </button>
  );
};

export default Button;
