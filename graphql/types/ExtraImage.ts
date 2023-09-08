import { objectType } from "nexus";

export const ExtraImage = objectType({
  name: "ExtraImage",
  definition(t) {
    t.int("id");
    t.field("product", { type: "Product" });
    t.int("productId");
    t.string("description");
    t.string("image");
  },
});
