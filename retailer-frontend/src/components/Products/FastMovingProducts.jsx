const data = [
  {
    name: "Anchor Milk Powder",
    orders: 145,
    growth: "+22%",
  },
  {
    name: "Sunlight Soap",
    orders: 122,
    growth: "+12%",
  },
  {
    name: "Lifebuoy Soap",
    orders: 110,
    growth: "+15%",
  },
  {
    name: "Pepsi 1.5L",
    orders: 95,
    growth: "+12%",
  },
  {
    name: "Tide Detergent",
    orders: 80,
    growth: "+10%",
  },
];

export default function FastMovingProducts() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">

      <h2 className="text-xl font-semibold mb-4">
        Fast Moving Products
      </h2>

      <table className="w-full">

        <thead>
          <tr className="border-b">
            <th className="text-left py-3">
              Product
            </th>
            <th>Orders</th>
            <th>Growth</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={item.name}
              className="border-b"
            >
              <td className="py-3">
                {item.name}
              </td>

              <td className="text-center">
                {item.orders}
              </td>

              <td className="text-center text-green-600 font-semibold">
                {item.growth}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}