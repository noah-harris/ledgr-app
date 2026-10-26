import { fetchApi } from "../../Api";
import type { AccountView, AccountType } from "../../types";
import { useEffect, useState } from "react";
import AccountCard from "./AccountCard";
import Typography from "@mui/material/Typography";
import { Stack, Box } from "@mui/material";


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