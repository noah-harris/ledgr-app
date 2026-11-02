import { useUser } from "../hooks";

export default function User() {
  return (
    <>
      <pre>{JSON.stringify(useUser(), null, 2)}</pre>
    </>
  );
}