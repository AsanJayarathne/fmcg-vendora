const products = [
  { name: "Anchor Milk Powder", value: 145 },
  { name: "Sunlight Soap", value: 122 },
  { name: "Lifebuoy Soap", value: 110 },
  { name: "Pepsi 1.5L", value: 95 },
  { name: "Tide Detergent", value: 80 },
];

export default function MostOrderedProducts() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">

      <h2 className="font-semibold text-xl mb-5">
        Most Ordered Products
      </h2>

      <div className="space-y-5">

        {products.map((product) => (
          <div key={product.name}>

            <div className="flex justify-between mb-1">
              <span>{product.name}</span>
              <span>{product.value}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">

              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{
                  width: `${product.value / 1.5}%`,
                }}
              />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}