import db from "@/lib/db";
import Link from "next/link";
import TeamForm from "@/components/TeamForm";
import DeleteTeamButton from "@/components/DeleteTeamButton";
import EditTeamButton from "@/components/EditTeamButton";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const data = await db.load();
  const sorted = [...data.teams].sort((a, b) => a.name.localeCompare(b.name));
  const teams = sorted.map((team, i) => ({ ...team, overallRank: i + 1 }));

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">TEAM DIRECTORY</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <div key={team.id} className="bg-neutral-900 p-4 rounded-lg border border-neutral-700 relative">
            <div className="flex items-center gap-3 mb-2">
              {team.logo && (
                <img src={team.logo} alt="" className="h-12 w-12 object-contain flex-shrink-0" />
              )}
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {team.name}<sup className="text-neutral-500 text-[10px] ml-1">{team.overallRank}</sup>
                </h3>
                <p className="text-neutral-400 text-sm">{team.abbreviation}</p>
              </div>
            </div>
            <p className="text-sm text-neutral-300">{team.location}</p>
            <p className="text-sm text-neutral-400"><span className="font-bold">Owner:</span> {team.ownership}</p>
            <p className="text-sm text-neutral-400"><span className="font-bold">HC:</span> {team.head_coach || "—"}</p>
            <p className="text-sm text-neutral-400"><span className="font-bold">AC:</span> {team.assistant_coach || "—"}</p>
            <div className="flex justify-between items-end mt-3 gap-3">
              <Link href={`/teams/${team.id}`} className="text-sm text-neutral-300 hover:underline">
                View Roster →
              </Link>
              <div className="flex flex-col items-end gap-3">
                {team.colors && team.colors.length > 0 && (
                  <div className="flex gap-1" style={{ transform: "translateY(-4px)" }}>
                    {team.colors.map((c, i) => (
                      <div key={i} className="h-5 w-5 rounded border border-neutral-600" style={{ backgroundColor: c }} title={c} />
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  <EditTeamButton team={team} teams={teams} />
                  <DeleteTeamButton teamId={team.id} teamName={team.name} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <TeamForm teams={teams} />
      </div>
    </main>
  );
}
