import {
  nonNull,
  objectType,
  stringArg,
  extendType,
  intArg,
  floatArg,
} from "nexus";

export const Profile = objectType({
  name: "Profile",
  definition(t) {
    t.string("id");
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.int("dob_day");
    t.int("dob_month");
    t.string("address");
    t.string("street");
    t.string("city");
    t.string("zip");
    t.string("createdAt");
    t.string("updatedAt");
  },
});

export const AddProfile = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addProfile", {
      type: Profile,
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        dob_day: nonNull(intArg()),
        dob_month: nonNull(intArg()),
        address: nonNull(stringArg()),
        street: nonNull(stringArg()),
        city: nonNull(stringArg()),
        zip: nonNull(stringArg()),
      },
      async resolve(parent, args, ctx) {
        // console.log(parent);

        return await ctx.prisma.user.update({
          where: { email: "notifications.borl@gmail.com" },
          data: {
            profile: {
              upsert: {
                create: {
                  firstName: args.firstName,
                  lastName: args.lastName,
                  email: args.email,
                  dob_day: args.dob_day,
                  dob_month: args.dob_month,
                  address: args.address,
                  street: args.street,
                  city: args.city,
                  zip: args.zip,
                },
                update: {
                  firstName: args.firstName,
                  lastName: args.lastName,
                  email: args.email,
                  dob_day: args.dob_day,
                  dob_month: args.dob_month,
                  address: args.address,
                  street: args.street,
                  city: args.city,
                  zip: args.zip,
                },
              },
            },
          },
        });
      },
    });
  },
});

//  Get unique profile by userId
export const GetProfileByUserId = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getProfileByUserId", {
      type: Profile,
      args: {
        userId: nonNull(stringArg()),
      },
      async resolve(parent, args, ctx) {
        return await ctx.prisma.profile.findUnique({
          where: {
            userId: args.userId,
          },
        });
      },
    });
  },
});
