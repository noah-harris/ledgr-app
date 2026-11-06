import { Button } from "@mui/material";
import { useEffect } from "react";
import { fetchApi } from "../../Api";
import { useFileViewer } from "../../hooks";

export default function SortOrphanFilesToolPage() {
  const { file, setFile, viewer } = useFileViewer();


  useEffect(() => {
    async function fetchInitialOrphanFile() {
      const file = await fetchApi("/file/orphan");
      const fileData = await file.json();
      if (!fileData || fileData.length === 0) {
        return;
      }
      setFile(fileData[0]);
    }
    fetchInitialOrphanFile();
  }, []);

  async function allowFile(entity: string) {
    if (!file) return;
    await fetchApi(`/file/allow?entity=${entity}&idFile=${file.idFile}`, {method: "PUT"}); 

    setFile(undefined);
    const newFile = await fetchApi("/file/orphan");
    const newFileData = await newFile.json();
    if (!newFileData || newFileData.length === 0) {
      setFile(undefined);
      return;
    }
    setFile(newFileData[0]);
  }
  
  return (
    <>
      {viewer}
      <Button onClick={() => allowFile("statement")}>Statement</Button>
      <Button onClick={() => allowFile("document")}>Document</Button>
      <Button onClick={() => allowFile("account")}>Account</Button>
      <Button onClick={() => allowFile("invoice")}>Invoice</Button>
      <Button onClick={() => allowFile("receipt")}>Receipt</Button>
      <Button onClick={() => allowFile("transaction")}>Transaction</Button>
      <Button onClick={() => fetchApi(`/file/junk?idFile=${file?.idFile}&isJunk=1`, {method: "PUT"})}>Set Junk</Button>
    </>
  );
}