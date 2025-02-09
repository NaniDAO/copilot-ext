export default function CreateWallet() {
  const [password, setPassword] = useState("");

  const handleCreateWallet = async () => {
    // Password validation
    if (!password) {
      alert("Please enter a password");
      return;
    }

    try {
      // Generate random wallet
      const wallet = ethers.Wallet.createRandom();

      // Encrypt wallet with password
      const encryptedWallet = await wallet.encrypt(password);

      // Store encrypted wallet
      localStorage.setItem("encryptedWallet", encryptedWallet);

      alert("Wallet created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating wallet");
    }
  };

  return (
    <div className="wallet-create">
      <h2>Create Wallet</h2>
      <div>
        <label>
          Choose a password for encryption:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleCreateWallet}>Create Wallet</button>
    </div>
  );
}
