import { fetchApi } from "../../Api";
import { useEffect, useState } from "react";
import { Stack, Box, Typography } from "@mui/material";

import AccountCard from "./AccountCard";

import type { AccountView, AccountType } from "../../types";


export default function AccountPage() {
  const [accounts, setAccounts] = useState<AccountView[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  
 accounts.sort((a, b) => a.AccountTypeName.localeCompare(b.AccountTypeName))

  useEffect(() => {
    fetchApi("/accounts")
    .then((r) => r.json())
    .then(setAccounts);
  }, []);

  useEffect(() => {
    fetchApi("/account/types")
    .then((r) => r.json())
    .then(setAccountTypes);
  }, []);
  
  return (
    <>
    {accountTypes.map((accountType) => (
      <Box key={accountType.idAccountType}>
        <Typography variant="h5">{accountType.AccountTypeName}</Typography>
        <Stack spacing={1}>
          {accounts.filter((account) => account.AccountTypeName === accountType.AccountTypeName).map((account) => (<AccountCard key={account.idAccount} account={account} />))}
        </Stack>
      </Box>
    ))} 
    </>
  );
}