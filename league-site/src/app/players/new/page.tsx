import PlayerForm from "@/components/PlayerForm";

export default function NewPlayerPage() {
  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">CREATE PLAYER</h2>
      <PlayerForm />
    </main>
  );
}
