export default function useFileShare() {
  
  const onShare = () => {
    console.log("Share file");
  };

  return { onShare };
}