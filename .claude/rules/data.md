# Data Rules

- All data stored in localStorage under key `fitness:data:v1`
- Data shape: `{ workouts: [], meals: [] }`
- Each entry has: `id` (Date.now()), `date` (YYYY-MM-DD), plus type-specific fields
- Never mutate state directly — always use setter functions
- Keep storage writes in a useEffect watching data changes
