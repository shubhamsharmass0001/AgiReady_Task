source .env
export NEXTAUTH_SECRET="my-super-secret-random-string-91028390"

npx vercel link --yes

echo "$DATABASE_URL" | npx vercel env add DATABASE_URL production || true
echo "$OPENAI_API_KEY" | npx vercel env add OPENAI_API_KEY production || true
echo "$GEMINI_API_KEY" | npx vercel env add GEMINI_API_KEY production || true
echo "$GOOGLE_CLIENT_ID" | npx vercel env add GOOGLE_CLIENT_ID production || true
echo "$GOOGLE_CLIENT_SECRET" | npx vercel env add GOOGLE_CLIENT_SECRET production || true
echo "$NEXTAUTH_SECRET" | npx vercel env add NEXTAUTH_SECRET production || true

npx vercel env pull --yes --environment=production
npx vercel --prod --yes
