"use client";
import Action from "@/components/dashboards/style-02/Action";
import Dropdown from "@/components/shared/Dropdown";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import usePagination from "@/utils/usePagination";
import { IconSelector } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { transactionsData } from "../bank-account/PaymentAccount";
import { useCookies } from "next-client-cookies";
import { UserType } from "@/utils/UserContext";
import { client } from "@/utils/sanityClient";

enum TransactionStatus {
  Active = "Active",
  Pending = "Pending",
  Frozen = "Frozen",
}

type Transaction = {
  id: number;
  account: string;
  icon: string;
  currency: {
    short: string;
    long: string;
  };
  bank: {
    name: string;
    country: string;
  };
  balance: number;
  expire: string;
  status: TransactionStatus;
};
type Order = "ASC" | "DSC";

type SortDataFunction = (col: keyof Transaction) => void;

const sortOptions = ["Recent", "Name", "Amount"];

const formatCurrency = (amount = 0, locale = "en-US", currency = "EUR") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const PaymentAccount = () => {
  const cookies = useCookies();
  const [user, setUser] = useState<UserType>(
    JSON.parse(cookies.get("currentUser") as string),
  );

  const [tableData, setTableData] = useState<any>([
    {
      id: 4,
      account: `${user.bank_account}`,
      icon: "/images/uk-sm.png",
      expire: `${user.expiry_date}`,
      currency: {
        long: "EURO",
        short: "EUR",
      },
      bank: {
        name: "Barclays Bank",
        country: "UK",
      },
      status: user.status,
      balance: formatCurrency(user.total_income),
    },
  ]);
  const [order, setOrder] = useState<Order>("ASC");
  const [selected, setSelected] = useState(sortOptions[0]);
  const itemsPerPage = 10;
  const {
    currentPage,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
    totalPages,
  } = usePagination(tableData.length, itemsPerPage);

  const displayedData: any = tableData.slice(startIndex, endIndex + 1);

  const sortData: SortDataFunction = (col) => {
    const [parentCol, childCol] = col.split(".");

    if (order === "ASC") {
      const sorted = [...tableData].sort((a: any, b: any) => {
        const aValue = childCol ? a[parentCol][childCol] : a[col];
        const bValue = childCol ? b[parentCol][childCol] : b[col];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.toLowerCase() > bValue.toLowerCase() ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });

      setTableData(sorted);
      setOrder("DSC");
    } else {
      const sorted = [...tableData].sort((a: any, b: any) => {
        const aValue = childCol ? a[parentCol][childCol] : a[col];
        const bValue = childCol ? b[parentCol][childCol] : b[col];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.toLowerCase() < bValue.toLowerCase() ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setTableData(sorted);
      setOrder("ASC");
    }
  };
  const onDelete = (id: number) => {
    const remained = tableData.filter((item: any) => item.id !== id);
    setTableData(remained);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const result = transactionsData.filter(
      (item) =>
        item.bank.name.toLowerCase().includes(searchTerm) ||
        item.currency.long.toLowerCase().includes(searchTerm) ||
        item.account.includes(searchTerm),
    );
    setTableData(result);
  };

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
    <div className="box col-span-12 md:col-span-7 xxl:col-span-8">
      <div className="flex justify-between items-center gap-4 flex-wrap bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Payment Account</h4>
        {/* <div className="flex items-center gap-4 flex-wrap grow sm:justify-end">
          <SearchBar handleSearch={handleSearch} classes="bg-primary/5" />
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span>Sort By : </span>
            <Dropdown
              setSelected={setSelected}
              selected={selected}
              items={sortOptions}
              btnClass="rounded-[32px] lg:py-2.5"
              contentClass="w-full"
            />
          </div>
        </div> */}
      </div>
      <div className="overflow-x-auto mb-4 lg:mb-6">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-secondary1/5 dark:bg-bg3">
              <th
                onClick={() => sortData("account")}
                className="text-start py-5 px-6 cursor-pointer min-w-[220px]"
              >
                <div className="flex items-center gap-1">
                  Account Number <IconSelector size={18} />
                </div>
              </th>
              <th
                onClick={() => sortData("currency")}
                className="text-start py-5 min-w-[120px] cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Currency <IconSelector size={18} />
                </div>
              </th>
              <th
                onClick={() => sortData("balance")}
                className="text-start py-5 min-w-[180px] cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Account Balance <IconSelector size={18} />
                </div>
              </th>
              <th
                onClick={() => sortData("status")}
                className="text-start py-5 cursor-pointer min-w-[120px]"
              >
                <div className="flex items-center gap-1">
                  Status <IconSelector size={18} />
                </div>
              </th>
              {/* <th className="text-center p-5 ">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((itm: any) => (
              <tr
                key={itm.id}
                className="even:bg-secondary1/5 dark:even:bg-bg3"
              >
                <td className="py-2 px-6">
                  <div className="flex items-center gap-3">
                    <Image
                      src={itm.icon}
                      width={32}
                      height={32}
                      className="rounded-full"
                      alt="payment medium icon"
                    />
                    <div>
                      <p className="font-medium mb-1">{itm.account}</p>
                      <span className="text-xs">Account Number</span>
                    </div>
                  </div>
                </td>
                <td className="py-2">
                  <div>
                    <p className="font-medium">{itm.currency.short}</p>
                    <span className="text-xs">{itm.currency.long}</span>
                  </div>
                </td>
                <td className="py-2">
                  <div>
                    <p className="font-medium">{itm.balance}</p>
                    <span className="text-xs">Account Balance</span>
                  </div>
                </td>
                <td className="py-2">
                  <span
                    className={`block text-xs w-28 xxl:w-36 text-center rounded-[30px] dark:border-n500 border border-n30 py-2 ${
                      itm.status === TransactionStatus.Active.toLowerCase() &&
                      "bg-primary/10 dark:bg-bg3 text-primary"
                    } ${
                      itm.status === TransactionStatus.Frozen.toLowerCase() &&
                      "bg-secondary2/10 dark:bg-bg3 text-secondary2"
                    } ${
                      itm.status == TransactionStatus.Pending.toLowerCase() &&
                      "bg-secondary3/10 dark:bg-bg3 text-secondary3"
                    }`}
                  >
                    {itm.status.toUpperCase()}
                  </span>
                </td>
                {/* <td className="py-2">
                    <div className="flex justify-center">
                      <Action
                        onDelete={() => onDelete(id)}
                        fromBottom={
                          index == displayedData.length - 1 ||
                          index == displayedData.length - 2
                        }
                      />
                    </div>
                  </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        {tableData.length < 1 && (
          <div className="text-center py-10">
            <div className="text-center mx-auto max-w-[500px] max-md:flex flex-col items-center">
              <div className="px-5 lg:px-14 xl:px-24 mb-5">
                <i className="las text-primary la-search text-7xl"></i>
              </div>
              <h3 className="h3 mb-3 lg:mb-6">No matching results</h3>
              <p>
                Looks like we couldn&nbsp;t find any matching results for your
                search terms. Try other search terms.
              </p>
            </div>
          </div>
        )}
      </div>
      {tableData.length > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          nextPage={nextPage}
          startIndex={startIndex}
          endIndex={endIndex}
          prevPage={prevPage}
          total={tableData.length}
          goToPage={(page: number) => goToPage(page)}
        />
      )}
    </div>
  );
};

export default PaymentAccount;
