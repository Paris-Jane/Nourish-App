const colors: Record<string, string> = {
  Grains: "bg-[#D4B483]",
  Protein: "bg-[#C4714F]",
  Vegetable: "bg-[#7C9E87]",
  Fruit: "bg-[#E69C5C]",
  Dairy: "bg-[#E8D9B6]",
  Legume: "bg-[#9C7C63]",
};

export function NutritionDots({ foodGroups }: { foodGroups: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {foodGroups.map((group) => (
        <span key={group} className={`h-1.5 w-1.5 rounded-full ${colors[group] ?? "bg-nourish-muted"}`} />
      ))}
    </div>
  );
}
