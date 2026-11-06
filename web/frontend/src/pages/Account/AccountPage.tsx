import { useEffect, useState } from "react";
import { Stack, Box, Typography } from "@mui/material";
import { fetchApi } from "../../Api";
import { Loading } from "../../components";
import AccountCard from "./AccountCard";
import { useUser } from "../../hooks";
import type {  AccountType } from "../../types";

export default function AccountPage() {
  const { accounts, loading } = useUser();
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);

  useEffect(() => {
    fetchApi("/account/types")
    .then((r) => r.json())
    .then(setAccountTypes);
  }, []);
  
  return loading ? <Loading /> : (
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