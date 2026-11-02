import {
  Menubar,
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
} from "../..";
import { useFileUpload, useFileShare } from "../../../hooks";

import ExportIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";

export default function FileMenuBar({ exportFiles }: { exportFiles: () => void }) {
  const { selectAndUploadFiles, uploading, backdrop } = useFileUpload("/file/upload");
  const { onShare } = useFileShare();

  return (
    <>
    <Menubar>

      <MenuRoot>
        <MenuTrigger>File</MenuTrigger>
        <MenuPortal>
          <MenuPositioner sideOffset={4} alignOffset={-2}>
            <MenuPopup>
              <MenuItem icon={<UploadIcon />} onClick={selectAndUploadFiles} disabled={uploading}>Upload</MenuItem>
              <MenuItem icon={<ExportIcon />} onClick={() => exportFiles()}>Export</MenuItem>
              <MenuSeparator />
              <MenuSubmenuRoot>
                <MenuSubmenuTrigger icon={<ShareIcon />}>Share</MenuSubmenuTrigger>
                <MenuPortal>
                  <MenuPositioner alignOffset={-4}>
                    <MenuPopup>
                      <MenuItem icon={<EmailIcon />} onClick={onShare}>Send Email…</MenuItem>
                    </MenuPopup>
                  </MenuPositioner>
                </MenuPortal>
              </MenuSubmenuRoot>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>

    </Menubar>

    {backdrop}
    </>
  );
}