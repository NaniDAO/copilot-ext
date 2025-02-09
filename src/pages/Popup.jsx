import React, { useState, useEffect } from "react";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";
import "./Popup.css";
import Account from "./Account";
import Chat from "./Chat";
import PasswordModal from "./PasswordModal";

async function encryptData(password, data) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("test_salt"), // @TODO
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(data),
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encryptedBuffer)),
  };
}

async function decryptData(password, encryptedData) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("test_salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const iv = new Uint8Array(encryptedData.iv);
  const dataBuffer = new Uint8Array(encryptedData.data);
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    dataBuffer,
  );
  return new TextDecoder().decode(decryptedBuffer);
}

export default function WalletManager() {
  const [decryptedWallet, setDecryptedWallet] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [walletExists, setWalletExists] = useState(false);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["naniWalletMnemonic"], async (result) => {
        if (result.naniWalletMnemonic) {
          setWalletExists(true);
          setShowPasswordModal(true);
        }
        setIsLoaded(true);
      });
    } else {
      setIsLoaded(true);
      setError("Chrome extension API not available");
    }
  }, []);

  const handlePasswordSubmit = async (userPassword) => {
    try {
      const storedData = await chrome.storage.local.get(["naniWalletMnemonic"]);
      const decryptedMnemonic = await decryptData(
        userPassword,
        storedData.naniWalletMnemonic,
      );
      const account = mnemonicToAccount(decryptedMnemonic);
      setDecryptedWallet({ mnemonic: decryptedMnemonic, account });
      setShowPasswordModal(false);
    } catch (err) {
      console.error("Failed to decrypt mnemonic", err);
      setError("Incorrect password or data corrupted.");
    }
  };

  const handleCreateWallet = async () => {
    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (typeof chrome === "undefined" || !chrome.storage) {
      setError("Chrome extension API not available");
      return;
    }

    const newMnemonic = generateMnemonic(english);
    const account = mnemonicToAccount(newMnemonic);
    try {
      const naniWalletMnemonic = await encryptData(password, newMnemonic);
      chrome.storage.local.set({ naniWalletMnemonic }, () => {
        console.log("Wallet saved securely.");
        setDecryptedWallet({ mnemonic: newMnemonic, account });
      });
    } catch (err) {
      console.error("Encryption failed", err);
      setError("Encryption error, please try again.");
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* If a wallet exists, only show the password modal until it is decrypted */}
      {walletExists && showPasswordModal && (
        <PasswordModal onSubmit={handlePasswordSubmit} />
      )}

      {/* If no wallet exists and nothing is decrypted yet, show the create wallet UI */}
      {!walletExists && !decryptedWallet && (
        <div className="wallet-create">
          <h2>Nani Wallet</h2>
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
      )}

      {/* When the wallet is decrypted, show the account and chat UI */}
      {decryptedWallet && (
        <>
          <Account wallet={decryptedWallet.account} />
          <Chat />
        </>
      )}

      <img src={"/default.png"} alt="Default" />
    </div>
  );
}
