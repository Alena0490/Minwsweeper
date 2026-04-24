type ButtonProps = {
  label: string;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

const Button = ({ label, handleClick, className }: ButtonProps) => {
    // Sound feedback
  const playSound = () => {
    const audio = new Audio('click.mp3');
    audio.volume = 1;
    audio.play().catch(() => {});
  }
  // Vibration feedback
  const vibrate = () => {
  if ('vibrate' in navigator) {
    // Different vibration patterns based on button type
    if (label === 'Clear') {
      navigator.vibrate(30); // Longer vibration for Clear
    } else if (label === '=') {
      navigator.vibrate([10, 5, 10]); // Double pulse for Equals
    } else {
      navigator.vibrate(10); // Short vibration for other buttons
    }
  }
};

  const handleClickWithFeedback = (event: React.MouseEvent<HTMLButtonElement>) => {
    playSound();
    vibrate();
    handleClick(event);
  };

  return (
    <button
      type="button"
      value={label}
      onClick={handleClickWithFeedback}
      className={className}
    >
      {label}
    </button>
  );
};

export default Button;