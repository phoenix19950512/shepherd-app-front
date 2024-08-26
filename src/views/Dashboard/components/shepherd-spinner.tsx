const ShepherdSpinner = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <img
      src="/images/logo-blue.svg"
      alt="shepherd-logo"
      loading="eager"
      className="h-20 w-20 animate-bounce"
    />
    </div>
  );
};

export default ShepherdSpinner;
