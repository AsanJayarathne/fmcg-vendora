import { useState } from "react";
import ProfileSettings from "../components/settings/ProfileSettings";
import ChangePasswordModal from "../components/settings/ChangePasswordModal";

export default function SettingsPage() {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const user = {
    fullName: "Asan Jayarathne",
    email: "asan.jayarathne@gmail.com",
    phone: "071 234 5678",
    address: "Kegalle, Sri Lanka",
  };

  return (
    <div>
      <ProfileSettings
        user={user}
        onChangePassword={() => setIsPasswordOpen(true)}
      />

      {isPasswordOpen && (
        <ChangePasswordModal onClose={() => setIsPasswordOpen(false)} />
      )}
    </div>
  );
}