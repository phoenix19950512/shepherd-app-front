import { Button } from '../../../../../../../../../../components/ui/button';

const ScoreButton = ({ disabled, className, onClick, icon, text }) => {
  return (
    <Button disabled={disabled} className={className} onClick={onClick}>
      {icon}
      {text}
    </Button>
  );
};

export default ScoreButton;
