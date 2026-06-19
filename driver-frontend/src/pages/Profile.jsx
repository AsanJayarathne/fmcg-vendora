import { Mail, Phone, MapPin, IdCard } from 'lucide-react';
function Profile() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-800">Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Your account details</p>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-lg font-medium">
              KP
            </div>
            <div>
              <div className="text-base font-medium text-gray-800">Kamal Perera</div>
              <div className="text-xs text-gray-400 mt-0.5">Delivery Driver · D001</div>
              <div className="mt-1.5">
                <span className="text-xs bg-purple-100 text-purple-600 px-3 py-0.5 rounded-full">
                  On Duty
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: Mail, label: 'Email', value: 'kamal@vendora.lk' },
              { icon: Phone, label: 'Phone', value: '071 234 5678' },
              { icon: MapPin, label: 'District', value: 'Colombo' },
              { icon: IdCard, label: 'Driver ID', value: 'D001' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <item.icon size={14} />
                  {item.label}
                </div>
                <div className="text-xs font-medium text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4">Performance summary</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Total deliveries', value: '248', color: 'text-purple-600' },
              { label: 'Successful deliveries', value: '241', color: 'text-green-600' },
              { label: 'Returned orders', value: '7', color: 'text-red-500' },
              { label: 'Success rate', value: '97%', color: 'text-amber-600' },
              { label: 'Member since', value: 'Jan 2025', color: 'text-gray-800' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className={`text-sm font-medium ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;