import { CardLegendaryUser } from './cards';

export const TopContributionUser = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Top Contribution User</h2>
      <div className="grid grid-cols-3 gap-4">
        {new Array(9).fill('').map((_, i) => (
          <CardLegendaryUser key={i} />
        ))}
      </div>
    </div>
  );
};
