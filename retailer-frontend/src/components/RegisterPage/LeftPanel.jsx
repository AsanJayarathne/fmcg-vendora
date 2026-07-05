import loginImage from "../../assets/images/shop.png";

function LeftPanel() {
  return (
    <div className="w-[38%] bg-[#2546D8] rounded-[40px] flex justify-center items-center overflow-hidden">

      <img
        src={loginImage}
        alt="Shopping"
        className="w-[70%]"
      />

    </div>
  );
}
export default LeftPanel;