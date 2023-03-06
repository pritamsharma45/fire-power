import { useRouter } from "next/router";

export default function Result() {
  const router = useRouter();
  const { sessionId } = router.query;

  return (
    <div>
      <h1>Result</h1>
      <p>Success</p>
    </div>
  );
}
