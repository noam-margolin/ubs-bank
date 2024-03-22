"use client";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import barclaysLogo from "@/public/images/ubs-logo.png";
import barclaysBuilding from "@/public/images/ubs-building.jpg";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { client } from "@/utils/sanityClient";
import { UserType, useUser } from "@/utils/UserContext";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useUser();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    setErrorMessage("");
    setLoading(true);
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("Response is", response);

    if (response?.status === 401) {
      setErrorMessage("Invalid credentials");
    }

    if (response?.status === 200 && response?.ok) {
      const authUser = await client.fetch(
        `*[_type == "user" && email == $email && password == $password]`,
        {
          email,
          password,
        },
      );

      if (authUser[0]?.length) {
        const {
          name,
          email,
          password,
          avatar,
          total_income,
          total_spending,
          total_transactions,
          status,
        } = authUser[0];

        setUser({
          name,
          email,
          password,
          avatar,
          total_income,
          total_spending,
          total_transactions,
          status,
        } as UserType);
      }

      console.log("Auth user from sign in page", authUser);

      router.push("/dashboards/details");
      return setLoading(false);
    }

    return setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center py-10">
        <Image width={174} height={38} src={barclaysLogo} alt="logo" />
      </div>
      <div className="box p-3 md:p-4 xl:p-6 grid grid-cols-12 gap-6 items-center">
        <form onSubmit={onSubmit} className="col-span-12 lg:col-span-7">
          <div className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8 border border-n30 dark:border-n500">
            <h3 className="h3 mb-4">Welcome to Barclays Bank!</h3>
            <p className="md:mb-6 md:pb-6 mb-4 pb-4 bb-dashed text-sm md:text-base">
              Sign in to your account and join us
            </p>
            <label
              htmlFor="email"
              className="md:text-lg font-medium block mb-4"
            >
              Enter Your Email ID
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full text-sm bg-n0 dark:bg-bg4 border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 mb-5"
              placeholder="Enter Your Email"
              id="email"
              required
            />
            <label
              htmlFor="password"
              className="md:text-lg font-medium block mb-4"
            >
              Enter Your Password
            </label>
            <div className=" bg-n0 dark:bg-bg4 border border-n30 dark:border-n500 rounded-3xl px-3 md:px-6 py-2 md:py-3 mb-4 relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPass ? "text" : "password"}
                className="w-11/12 text-sm bg-transparent"
                placeholder="Enter Your Password"
                id="password"
                required
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute ltr:right-5 rtl:left-5 top-1/2 cursor-pointer -translate-y-1/2"
              >
                {showPass ? <IconEye /> : <IconEyeOff />}
              </span>
            </div>
            {errorMessage && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}

            {/* <Link href="#" className="flex justify-end text-primary">
            Forgot Password
          </Link> */}
            {/* <p className="mt-3">
            Don&apos;t have an account?{" "}
            <Link className="text-primary" href="/auth/sign-up">
              Signup
            </Link>
          </p> */}
            <div className="mt-8 flex gap-6">
              <button disabled={loading} type="submit" className="btn px-5">
                Login
                {loading && (
                  <FontAwesomeIcon
                    className="animate-spin rounded-full"
                    icon={faSpinner}
                  />
                )}
              </button>
            </div>
          </div>
        </form>
        <div className="col-span-12 lg:col-span-5">
          <Image src={barclaysBuilding} alt="img" width={533} height={560} />
        </div>
      </div>
    </>
  );
};

export default SignIn;
