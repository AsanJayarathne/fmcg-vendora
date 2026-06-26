import React from 'react';

const YearlyStockChart = () => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-slate-700 mb-4">Yearly Total Stock</h2>
      <div className="bg-[#f2f4fa] rounded-2xl p-6 flex-1 relative h-[250px] flex items-center justify-center">
        {/* Simple SVG Line Chart */}
        <div className="absolute left-6 top-6 bottom-10 flex flex-col justify-between text-xs font-medium text-blue-300">
          <span>$40,000</span>
          <span>$30,000</span>
          <span>$20,000</span>
          <span>$10,000</span>
          <span>$0</span>
        </div>
        {/* Grid lines */}
        <div className="absolute left-16 right-6 top-8 bottom-12 flex flex-col justify-between border-l border-b border-transparent">
           <div className="w-full border-b border-dashed border-blue-100"></div>
           <div className="w-full border-b border-dashed border-blue-100"></div>
           <div className="w-full border-b border-dashed border-blue-100"></div>
           <div className="w-full border-b border-dashed border-blue-100"></div>
           <div className="w-full border-b border-dashed border-blue-100"></div>
        </div>
        
        <svg className="absolute left-16 right-6 top-8 bottom-12 h-[calc(100%-80px)] w-[calc(100%-88px)] overflow-visible" preserveAspectRatio="none">
           <path d="M0,100 L50,40 L100,70 L150,0 L200,50 L250,20" 
                 fill="none" 
                 stroke="#2563eb" 
                 strokeWidth="2"
                 vectorEffect="non-scaling-stroke"
                 transform="scale(1, 0.9) translate(0, 5)"
           />
           <g transform="scale(1, 0.9) translate(0, 5)">
             <circle cx="0" cy="100" r="4" fill="white" stroke="#2563eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
             <circle cx="50" cy="40" r="4" fill="white" stroke="#2563eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
             <circle cx="100" cy="70" r="4" fill="white" stroke="#2563eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
             <circle cx="150" cy="0" r="4" fill="white" stroke="#2563eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
             <circle cx="200" cy="50" r="4" fill="white" stroke="#2563eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
             <circle cx="250" cy="20" r="4" fill="white" stroke="#2563eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
           </g>
        </svg>

        <div className="absolute left-16 right-6 bottom-4 flex justify-between text-xs font-semibold text-blue-400">
          <span className="-ml-3">2016</span>
          <span>2017</span>
          <span>2018</span>
          <span>2019</span>
          <span>2020</span>
          <span className="-mr-3">2021</span>
        </div>
      </div>
    </div>
  );
};

export default YearlyStockChart;
