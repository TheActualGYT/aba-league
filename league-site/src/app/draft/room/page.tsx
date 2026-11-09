const ROUNDS = 5;
const PICKS = 20;

function boardRows() {
  return Array.from({ length: ROUNDS }, (_, index) => {
    const round = index + 1;
    const picks = Array.from({ length: PICKS }, (_, pick) => pick + 1);
    const order = round % 2 === 0 ? [...picks].reverse() : picks;
    return order.map(pick => `${round}.${String(pick).padStart(2, "0")}`);
  });
}

export default function DraftRoomPage() {
  const rows = boardRows();

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <div className="overflow-x-auto rounded-lg border border-neutral-600">
        <table className="w-full min-w-[980px] table-fixed border-collapse text-center">
          <thead>
            <tr>
              <th colSpan={PICKS} className="border border-neutral-600 bg-neutral-100 px-3 py-2 text-left text-sm font-bold tracking-wide text-black">
                DRAFT BOARD
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row[0]}>
                {row.map(slot => (
                  <td key={slot} className="border border-neutral-600 bg-neutral-950 px-0.5 py-3 text-[11px] leading-none text-neutral-100">
                    {slot}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
