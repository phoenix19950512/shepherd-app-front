import useUserStore from '../../../../../../../../../../state/userStore';

const WelcomeBackText = () => {
  const { name } = useUserStore((state) => state.user);
  return (
    <h3 className="text-black text-2xl w-full absolute top-[-6rem] text-center font-semibold">
      Welcome Back, {name.first}
    </h3>
  );
};
export default WelcomeBackText;
