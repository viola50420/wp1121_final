import { SignUp } from "@clerk/nextjs";
const SignUpPage = () => {
  return (
    <>
      <SignUp signInUrl="/signIn" />
    </>
  );
};
export default SignUpPage;
