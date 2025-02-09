import { useAccount } from "wagmi";
import "./Account.css";

export default function Account({ wallet }) {
  const { address, chain } = useAccount();

  return (
    <div className="account-container">
      <div className="address-display">
        {wallet ? wallet?.address : "No Address"}
      </div>
      <span> / </span>
      <div className="connection-status">{chain?.name || "Not Connected"}</div>
    </div>
  );
}
