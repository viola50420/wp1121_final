import { SignIn } from "@clerk/nextjs";
const SignInPage = () => {
  return (
    <>
      <SignIn signUpUrl="/signUp" />
    </>
  );
};
export default SignInPage;
