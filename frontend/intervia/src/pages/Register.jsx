import { SignUp } from "@clerk/clerk-react";

const Register = () => {
  return (
    <>
      <div>Register</div>
      <div className="flex justify-center items-center">
        <SignUp />
      </div>
    </>
  );
};

export default Register;
