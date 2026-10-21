// ตั้งค่า Supabase & AI Gateway
const CONFIG = {
  SUPABASE_URL: "https://taytdxazdippihjpdroi.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRheXRkeGF6ZGlwcGloanBkcm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NDgxMjAsImV4cCI6MjEwODEyNDEyMH0.aDLPSQH58Nbd_mOYH8AbH9xTmb7YikcDqkCQGQU7Cr8",
  SUPABASE_BUCKET: "command-images",
  OPENAI_API_KEY: (typeof atob !== 'undefined') ? atob("c2stcHJvai12X2pmZUw2VllQRUVqdW9OYnpraVBJQkV5S3dRZGl6MGFlVGhteVRSYVBhdm11dmpkV084Q1pnVE9xMnRaSFZhR0pGQXpEUEgtOVQzQmxia0ZKc1gtN3NCOXpJRERYVlNaWDh2SElyUUpqaEl3d0xtS3BoZG84b3RmaW5wR2VGLVV0cU13Z1V2VVhLZDNUZl8wVFBGTXRyS3Z4Y0E=") : ""
};

if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}

export default CONFIG;
