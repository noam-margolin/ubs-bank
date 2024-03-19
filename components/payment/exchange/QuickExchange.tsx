"use client";
import OptionsHorizontal from "@/components/shared/OptionsHorizontal";
import { UserType } from "@/utils/UserContext";
import { client } from "@/utils/sanityClient";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const formatCurrency = (amount = 0, locale = "en-US", currency = "EUR") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const QuickExchange = () => {
  const [flipped, setFlipped] = useState(false);
  const cookies = useCookies();
  const [user, setUser] = useState<UserType>(
    JSON.parse(cookies.get("currentUser") as string),
  );

  useEffect(() => {
    const query = '*[_type == "user" && email == $email]';
    const params = { email: user.email };

    const subscription = client.listen(query, params).subscribe((update) => {
      console.log("Update is", update);

      const {
        name,
        email,
        total_income,
        total_transactions,
        total_spending,
        spending_goal,
        password,
        bank_account,
        expiry_date,
        status,
      } = update.result as UserType | any;

      const newUser = {
        ...user,
        name,
        email,
        total_income,
        total_transactions,
        total_spending,
        spending_goal,
        password,
        bank_account,
        expiry_date,
        status,
      };

      console.log("New user is", newUser);

      cookies.set("currentUser", JSON.stringify(newUser));

      setUser(newUser);
    });

    return () => subscription.unsubscribe();
  }, [user, cookies]);

  return (
    <div className="box">
      <div className="bb-dashed pb-4 mb-4 lg:mb-6 lg:pb-6 flex justify-between items-center">
        <p className="font-medium">Quick Exchange</p>
        {/* <OptionsHorizontal /> */}
      </div>
      <p className="font-medium mb-10">
        This feature is disabled for your account
      </p>
      <div className="bb-dashed pb-4 mb-4 lg:mb-6 lg:pb-6 flex flex-col">
        <div
          className={`box border border-n30 dark:border-n500 bg-primary/5 dark:bg-bg3 ${
            flipped ? "order-3" : "order-1"
          }`}
        >
          <div className="flex justify-between bb-dashed items-center text-sm mb-4 pb-4">
            <p>Spend</p>
            <p>Balance : $ 0</p>
          </div>
          <div className="flex justify-between items-center text-xl gap-4 font-medium">
            <input
              type="number"
              className="w-20 bg-transparent"
              placeholder="0.00"
            />
            <p className="shrink-0">$ USD</p>
          </div>
        </div>
        <button
          onClick={() => setFlipped((prev) => !prev)}
          className="p-2 border order-2 border-n30 dark:border-n500 self-center -my-4 relative z-[2] rounded-lg bg-n0 dark:bg-bg4 text-primary"
        >
          <i className="las la-exchange-alt rotate-90"></i>
        </button>
        <div
          className={`box border border-n30 dark:border-n500 bg-primary/5 dark:bg-bg3 ${
            flipped ? "order-1" : "order-3"
          }`}
        >
          <div className="flex justify-between bb-dashed items-center text-sm mb-4 pb-4">
            <p>Receive</p>
            <p>Balance : {formatCurrency(user.total_income)}</p>
          </div>
          <div className="flex justify-between items-center text-xl gap-4 font-medium">
            <input
              type="number"
              className="w-20 bg-transparent"
              placeholder="0.00"
            />
            <p className="shrink-0">€ EURO</p>
          </div>
        </div>
      </div>
      <div>
        {/* <p className="text-lg font-medium mb-6">Payment Method</p>
        <div className="border border-primary border-dashed bg-primary/5 rounded-lg p-3 flex items-center gap-4 mb-6 lg:mb-8">
          <Image
            src="/images/card-sm-1.png"
            width={60}
            height={40}
            alt="card"
          />
          <div>
            <p className="font-medium mb-1">John Snow - Metal</p>
            <span className="text-xs">**4291 - Exp: 12/26</span>
          </div>
        </div> */}
        <Link
          href="#"
          aria-disabled
          className="btn flex justify-center w-full aria-disabled:bg-gray-300 text-gray-500 py-2 px-4 rounded cursor-not-allowed opacity-50"
        >
          Exchange Now
        </Link>
      </div>
    </div>
  );
};

export default QuickExchange;
