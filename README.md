# nextjs-supabase-posts

En Next.js-app med login fra Supabase Auth og en Post App med `users` og `posts` i Supabase. Startprojektet til 10. november: User management, roller og beskyttet adgang.

Appen virker allerede: Du kan logge ind, se alle posts med deres bruger og oprette, rette og slette posts. Men login og data hænger ikke sammen endnu:

- `users` er ikke koblet til `auth.users`. En bruger, der logger ind, findes ikke i `users`.
- Nye posts får altid det samme faste `CURRENT_USER_ID` fra `lib/current-user.js` – ligesom i Post App.
- Alle kan rette og slette alle posts, også uden at være logget ind. Row Level Security er slået fra.

Det er det, du retter i dag.

## Kom i gang

1. Klik på **Use this template → Create a new repository**, og klon dit nye repository i VS Code eller GitHub Desktop.
2. Kør `npm install` i terminalen.
3. Kopiér `.env.example` til `.env.local`, og indsæt URL og publishable key fra **Connect**-panelet i dit Supabase-projekt. Du kan genbruge projektet fra 30. oktober.
4. Åbn **SQL Editor** i Supabase, indsæt hele [`supabase/setup.sql`](supabase/setup.sql), og klik på **Run**. Filen opretter `users` og `posts` med 5 brugere og 10 posts.
5. Kør `npm run dev`, og åbn [http://localhost:3000](http://localhost:3000).

## Datamodellen

```text
auth.users            users                         posts
(Supabase Auth)       id          uuid  PK  <----   user_id     uuid  FK
id     uuid    ?      name        text              id          bigint PK
email  text           mail        text              caption     text
...                   title       text              image       text
                      image       text              created_at  timestamptz
                      created_at  timestamptz
```

`posts.user_id` peger på `users.id` – samme en-til-mange-relation som `posts.userId` → `users.id` i Post App. Spørgsmålstegnet mellem `auth.users` og `users` er dagens første opgave.

## Routes

| Route | Fil | Side |
| --- | --- | --- |
| `/` | `app/page.js` | Alle posts med deres bruger |
| `/posts/[id]` | `app/posts/[id]/page.js` | Ét post med Edit og Delete |
| `/posts/[id]/update` | `app/posts/[id]/update/page.js` | Ret et post |
| `/create` | `app/create/page.js` | Opret et post |
| `/signup` | `app/signup/page.js` | Opret en bruger |
| `/login` | `app/login/page.js` | Log ind |
| `/profile` | `app/profile/page.js` | E-mail, bruger-id og log ud · kun logget ind |
