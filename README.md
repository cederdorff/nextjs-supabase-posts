# nextjs-supabase-posts

En Next.js-app med login fra Supabase Auth og en Post App med `users` og `posts` i Supabase. Startprojektet til 10. november: User management, roller og beskyttet adgang.

Appen virker allerede: Du kan oprette en bruger, logge ind, se alle posts med deres bruger og oprette, rette og slette posts. Al kode, der henter og gemmer data, er skrevet med Supabase SDK'et – med en kommentar, der viser, hvordan det samme så ud med `fetch` i Post App.

Men login og posts hænger ikke sammen endnu:

- Nye posts får altid det samme faste `CURRENT_USER_ID` fra `lib/current-user.js` – ligesom i Post App.
- Alle kan rette og slette alle posts, også uden at være logget ind.
- Row Level Security er slået fra, så alle med din publishable key kan ændre alt.

Det er det, du retter i dag.

## Kom i gang

1. Klik på **Use this template → Create a new repository**, og klon dit nye repository i VS Code eller GitHub Desktop.
2. Kør `npm install` i terminalen.
3. Kopiér `.env.example` til `.env.local`, og indsæt URL og publishable key fra **Connect**-panelet i dit Supabase-projekt. Du kan genbruge projektet fra 30. oktober.
4. Åbn **SQL Editor** i Supabase, indsæt hele [`supabase/setup.sql`](supabase/setup.sql), og klik på **Run**. Filen opretter `users` og `posts` med de samme 5 brugere og 10 posts som i Post App – og giver dine egne brugere en række i `users`. De 5 brugere fra Post App kan logge ind, fx `maria@example.com` med adgangskoden `postapp123`.
5. Kør `npm run dev`, og åbn [http://localhost:3000](http://localhost:3000).

## Datamodellen

Den samme relation som i Post App: Et post er lavet af én user, og en user kan lave mange posts. `posts.userId` peger på `users.id`.

```text
Login                      users                   posts
(Authentication → Users)   id     uuid  <------    userId     uuid
id     uuid  ---------->   name   text             id         uuid
email  text   samme id     mail   text             createdAt  timestamptz
                           title  text             caption    text
                           image  text             image      text
                           role   text
```

Det nye: Den, der er logget ind, er en række i `users` – med samme `id` som i Authentication. Appen opretter rækken, når nogen laver en bruger på `/signup`.

Alt i databasen kommer fra én fil: [`supabase/setup.sql`](supabase/setup.sql). Den kan køres igen, hvis du vil starte forfra.

## Routes

| Route | Fil | Side |
| --- | --- | --- |
| `/` | `app/page.js` | Alle posts med deres bruger |
| `/posts/[id]` | `app/posts/[id]/page.js` | Ét post med Edit og Delete |
| `/posts/[id]/update` | `app/posts/[id]/update/page.js` | Ret et post |
| `/create` | `app/create/page.js` | Opret et post |
| `/signup` | `app/signup/page.js` | Opret en bruger |
| `/login` | `app/login/page.js` | Log ind |
| `/profile` | `app/profile/page.js` | Din række i users og log ud · kun logget ind |

## Løsninger

`main` er startpunktet. Hver opgave har sin egen branch, der viser projektet, som det ser ud, når opgaven er løst. Klik på "diff" for kun at se det, der er nyt i den opgave. Opgaven står i [User management og beskyttet adgang](https://github.com/cederdorff/mdu-e25ixd/blob/main/undervisning/dynamic-user-interface/opgave-2026-11-10-user-management-roller-og-rls.md).

| Opgave | Branch | Ændring |
| --- | --- | --- |
| 1 · Kom i gang | [main](https://github.com/cederdorff/nextjs-supabase-posts/tree/main) | |
| 2 · Posts får en ejer | [opgave-02-ejer](https://github.com/cederdorff/nextjs-supabase-posts/tree/opgave-02-ejer) | [diff](https://github.com/cederdorff/nextjs-supabase-posts/compare/main...opgave-02-ejer) |
| 3 · Kun ejeren kan rette og slette | [opgave-03-kun-ejeren](https://github.com/cederdorff/nextjs-supabase-posts/tree/opgave-03-kun-ejeren) | [diff](https://github.com/cederdorff/nextjs-supabase-posts/compare/opgave-02-ejer...opgave-03-kun-ejeren) |
| 4 · Beskyt databasen | Ingen kode – et klik i Supabase | |
| 5 · Profil og roller | [opgave-05-roller](https://github.com/cederdorff/nextjs-supabase-posts/tree/opgave-05-roller) | [diff](https://github.com/cederdorff/nextjs-supabase-posts/compare/opgave-03-kun-ejeren...opgave-05-roller) |

Prøv selv først. Brug løsningen, når du sidder fast, eller når du vil sammenligne med din egen.

## Motion · 12. november

Branchen [motion](https://github.com/cederdorff/nextjs-supabase-posts/tree/motion) bygger videre på `opgave-05-roller` med tre microinteractions fra [Motion for React](https://motion.dev/docs/react) – se [alt det nye](https://github.com/cederdorff/nextjs-supabase-posts/compare/opgave-05-roller...motion).

| Microinteraction | Fil | Formål |
| --- | --- | --- |
| Post-cards løfter sig ved hover og focus | `components/AnimatedCard.js` | Feedback |
| *Save* skifter til *Saving …* | `components/SubmitButton.js` | Status |
| *Delete this post?* glider ind og ud | `components/DeleteButton.js` | Bekræftelse |

- Motion-tokens står i `lib/motion.js` og `app/globals.css`.
- `components/MotionProvider.js` respekterer reduced motion i hele appen.
- Prøv kortets tre varianter på forsiden: `/?variant=a`, `/?variant=b` og `/?variant=c`.
