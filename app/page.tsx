import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");

  return null;
  return (
    <div
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      Start prompting.
    </div>
  );
}
