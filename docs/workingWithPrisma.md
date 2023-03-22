### Working with Prisma ORM

1. Start prisma studio

```bash
npx prisma studio
```

This will open up the studio in localhost:5555. Here you can interact with tha actual database. Do CRUD operations. Filter records and view it.

2. Migrate database

```bash
npx prisma migrate dev
```

Run above command after adding new models or modifying the existing ones in prism/schema directory.

3. Seed Database

```bash
npx prisma db seed
```

4. References

-  [Prisma docs](https://www.prisma.io/docs/reference/api-reference)
