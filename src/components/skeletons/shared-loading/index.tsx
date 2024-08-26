function SharedLoading() {
  return (
    <div className="w-full h-full absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <div>
        <img
          src="/images/logo-blue.svg"
          alt="shepherd-logo"
          className="h-20 w-20 animate-bounce"
        />
      </div>
    </div>
  );
}

export default SharedLoading;
