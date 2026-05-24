# MiMo Pixel Detective

🕵️‍♂️ **AI-powered detective game** where you solve mysteries by interrogating suspects, collecting clues, and making your verdict. Built with Next.js 14 and powered by MiMo AI V2.5 Pro.

## 🎮 Game Features

- **AI-Generated Cases**: Each mystery is unique
- **3 Suspects**: Interrogate and uncover the truth
- **5 Clues**: Mix of real evidence and red herrings
- **Dynamic Dialogue**: AI-powered suspect responses
- **AI Judgment**: Your verdict is evaluated by advanced AI
- **Scoring System**: Get rated on deduction quality (0-100)
- **Quick Sessions**: Solve a mystery in 10-15 minutes

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to play!

## 🎯 Game Flow

1. **Crime Scene** → Read case details and victim info
2. **Suspects** → Interrogate 3 suspects with custom questions
3. **Clues** → Review 5 pieces of evidence
4. **Verdict** → Accuse the culprit and explain your reasoning
5. **Results** → Get AI judgment, score, and feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **AI Integration**: MiMo AI V2.5 Pro + Groq fallback
- **UI Components**: Radix UI

## 🔑 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_MIMO_API_KEY=your_mimo_api_key_here
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

**Note**: The game works with mock data if no API keys are provided (perfect for development).

## 📁 Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Homepage
├── crime-scene/page.tsx    # Case investigation
├── suspects/page.tsx       # Interrogation interface
├── clues/page.tsx          # Evidence board
├── verdict/page.tsx        # Accusation form
├── results/page.tsx        # AI judgment
└── api/
    ├── game/generate-case/ # Generate mystery case
    ├── ai/interrogate/     # Suspect responses
    └── ai/judge-verdict/   # Evaluate verdict

lib/
├── types/game.ts           # TypeScript interfaces
├── store/gameStore.ts      # Zustand state management
└── api/client.ts           # API client

components/
├── layout/                 # Header, Footer
└── game/                   # Game-specific components
```

## 🎨 Design

- **Theme**: Detective noir with pixel art aesthetic
- **Colors**: Dark slate background, yellow accents, red highlights
- **Typography**: Geist Sans (modern, clean)
- **Responsive**: Mobile-first design

## 🧪 Development

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Format code
npx prettier --write .
```

## 🚀 Deployment

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Vercel

1. Import your GitHub repository
2. Vercel auto-detects Next.js settings
3. Add environment variables in project settings
4. Deploy!

## 📝 MVP Requirements

✅ 1 case per session  
✅ 3 suspects  
✅ 5 clues  
✅ Final verdict  
✅ AI-generated mystery case  
✅ AI-generated suspect dialogue  
✅ AI-generated clues  
✅ AI judgment of accusation  

## 🎯 Future Enhancements

- Multiple case themes (murder, theft, espionage)
- Difficulty levels (easy, medium, hard)
- Leaderboard and achievements
- Multiplayer mode
- Case history and replay
- Custom case creator

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

**Built with ❤️ for MiMo Token Plan**  
Powered by Next.js 14 & MiMo AI V2.5 Pro
