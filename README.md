# Crypto Copilot 🤖💰

A browser extension that combines a secure crypto wallet with an AI-powered assistant using Gemini Flash 2.0. Your personal guide through the crypto space, capable of analyzing both text and visual content to provide informed assistance.

## Features ✨

- **Secure Wallet Management**
  - Local encrypted storage of wallet credentials
  - Mnemonic phrase generation
  - Password-protected access

- **AI Assistant**
  - Text and visual analysis using Gemini Flash 2.0
  - Real-time screenshot processing
  - Context-aware responses
  - Markdown support for better readability

## Technical Stack 🛠️

- React.js for the frontend
- Viem for Ethereum wallet operations
- Web Crypto API for secure encryption
- OpenRouter API for AI integration
- Chrome/Firefox Extension APIs

## Installation 🔧

1. Clone the repository
```bash
git clone https://github.com/NaniDAO/copilot-ext.git
```

2. Install dependencies
```bash
pnpm install
```

3. Build the extension
```bash
pnpm run build
```

4. Load the extension in your browser
   - Chrome: Navigate to `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked" and select the build directory

You can also `pnpm run dev` for development.

## Security Notes 🔒

- All wallet credentials are encrypted locally using AES-GCM
- No sensitive data is transmitted to external servers (the screenshots are however processed by openrouter endstream provider and handled according to their terms)
- Password-based key derivation using PBKDF2

## ⚠️ Disclaimer

This project was developed as part of a hackathon and is currently in an experimental state. It is NOT recommended for production use or managing significant crypto assets. Use at your own risk.

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License

AGPL-3.0 License

---

Built with ❤️ by NANI
