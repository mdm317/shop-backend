# Migration `20201014182151-init`

This migration has been generated at 10/15/2020, 3:21:51 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `shopmall`.`User` (
`id` varchar(191)  NOT NULL ,
`userId` varchar(191)  NOT NULL ,
`password` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`point` int  NOT NULL DEFAULT 0,
`email` varchar(191)  ,
`phone` varchar(191)  ,
`isAdmin` boolean  NOT NULL DEFAULT false,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE Index `User.userId_unique`(`userId`),
UNIQUE Index `User.email_unique`(`email`),
UNIQUE Index `User.phone_unique`(`phone`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`Product` (
`id` varchar(191)  NOT NULL ,
`price` int  NOT NULL ,
`stock` int  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`description` varchar(191)  ,
`thumbnail` varchar(191)  ,
`willDelete` boolean  NOT NULL DEFAULT false,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`Image` (
`id` varchar(191)  NOT NULL ,
`url` varchar(191)  NOT NULL ,
`productId` varchar(191)  NOT NULL ,
`idx` int  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`UserBuyProduct` (
`productId` varchar(191)  NOT NULL ,
`userId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`productId`,`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`Address` (
`id` varchar(191)  NOT NULL ,
`userId` varchar(191)  NOT NULL ,
`address` varchar(191)  NOT NULL ,
`additional` varchar(191)  ,
`zipcode` varchar(191)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`Qna` (
`id` varchar(191)  NOT NULL ,
`content` varchar(191)  NOT NULL ,
`userId` varchar(191)  NOT NULL ,
`productId` varchar(191)  NOT NULL ,
`answerId` varchar(191)  ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE Index `Qna_answerId_unique`(`answerId`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`Review` (
`id` varchar(191)  NOT NULL ,
`content` varchar(191)  NOT NULL ,
`rating` int  NOT NULL ,
`image` varchar(191)  ,
`userId` varchar(191)  NOT NULL ,
`productId` varchar(191)  NOT NULL ,
`orderId` varchar(191)  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`Order` (
`id` varchar(191)  NOT NULL ,
`userId` varchar(191)  NOT NULL ,
`orderNumber` varchar(191)  NOT NULL ,
`name` varchar(191)  NOT NULL ,
`address1` varchar(191)  NOT NULL ,
`address2` varchar(191)  ,
`zipcode` varchar(191)  NOT NULL ,
`phone` varchar(191)  NOT NULL ,
`message` varchar(191)  ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`Basket` (
`id` varchar(191)  NOT NULL ,
`userId` varchar(191)  ,
UNIQUE Index `Basket.userId_unique`(`userId`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`ProductInOrderCount` (
`orderId` varchar(191)  NOT NULL ,
`productId` varchar(191)  NOT NULL ,
`count` int  NOT NULL ,
PRIMARY KEY (`orderId`,`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`_OrderToProduct` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE Index `_OrderToProduct_AB_unique`(`A`,
`B`),
Index `_OrderToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `shopmall`.`_BasketToProduct` (
`A` varchar(191)  NOT NULL ,
`B` varchar(191)  NOT NULL ,
UNIQUE Index `_BasketToProduct_AB_unique`(`A`,
`B`),
Index `_BasketToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `shopmall`.`Image` ADD FOREIGN KEY (`productId`) REFERENCES `shopmall`.`Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`UserBuyProduct` ADD FOREIGN KEY (`productId`) REFERENCES `shopmall`.`Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`UserBuyProduct` ADD FOREIGN KEY (`userId`) REFERENCES `shopmall`.`User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`Address` ADD FOREIGN KEY (`userId`) REFERENCES `shopmall`.`User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`Qna` ADD FOREIGN KEY (`userId`) REFERENCES `shopmall`.`User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`Qna` ADD FOREIGN KEY (`productId`) REFERENCES `shopmall`.`Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`Qna` ADD FOREIGN KEY (`answerId`) REFERENCES `shopmall`.`Qna`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `shopmall`.`Review` ADD FOREIGN KEY (`userId`) REFERENCES `shopmall`.`User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`Review` ADD FOREIGN KEY (`productId`) REFERENCES `shopmall`.`Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`Review` ADD FOREIGN KEY (`orderId`) REFERENCES `shopmall`.`Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`Order` ADD FOREIGN KEY (`userId`) REFERENCES `shopmall`.`User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`Basket` ADD FOREIGN KEY (`userId`) REFERENCES `shopmall`.`User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `shopmall`.`ProductInOrderCount` ADD FOREIGN KEY (`orderId`) REFERENCES `shopmall`.`Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`ProductInOrderCount` ADD FOREIGN KEY (`productId`) REFERENCES `shopmall`.`Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`_OrderToProduct` ADD FOREIGN KEY (`A`) REFERENCES `shopmall`.`Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`_OrderToProduct` ADD FOREIGN KEY (`B`) REFERENCES `shopmall`.`Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`_BasketToProduct` ADD FOREIGN KEY (`A`) REFERENCES `shopmall`.`Basket`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `shopmall`.`_BasketToProduct` ADD FOREIGN KEY (`B`) REFERENCES `shopmall`.`Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

DROP TABLE `shopmall`.`_migration`
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201014182151-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,129 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+
+datasource db {
+  provider = "mysql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+  experimentalFeatures = ["connectOrCreate"]
+}
+model User {
+  id    String  @id @default(cuid())
+  userId String @unique
+  password String
+  name  String
+  point Int   @default(0)
+  email String? @unique
+  phone String?   @unique
+  isAdmin Boolean @default(false)
+  reviews Review[]
+  qnas Qna[]
+  basket Basket
+  orders Order[]
+  addresses Address[]
+  products UserBuyProduct[]
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+}
+model Product{
+  id    String  @id @default(cuid())
+  price Int 
+  stock Int 
+  name String
+  productImage Image[]
+  description String?
+  thumbnail String?
+  willDelete Boolean @default(false)
+  orders Order[]
+  reviews Review[]
+  qnas Qna[]
+  baskets Basket[]
+  users UserBuyProduct[]
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+}
+model Image{
+  id    String  @id @default(cuid())
+  url String
+  product Product     @relation(fields: [productId], references: [id])
+  productId      String
+  idx Int   
+}
+model UserBuyProduct {
+  product Product     @relation(fields: [productId], references: [id])
+  productId      String     
+  user    User @relation(fields: [userId], references: [id])
+  userId  String      // relation scalar field (used in the `@relation` attribute above)
+  createdAt   DateTime @default(now())
+  @@id([productId, userId])
+}
+model Address{
+  id    String  @id @default(cuid())
+  user  User @relation(fields:  [userId], references: [id])
+  userId String
+  address String 
+  additional String?
+  zipcode String
+}
+model Qna{
+  id    String  @id @default(cuid())
+  content String
+  user  User @relation(fields:  [userId], references: [id])
+  userId String
+  product  Product @relation(fields:  [productId], references: [id])
+  productId String
+  answer   Qna?   @relation("Qna", fields: [answerId], references: [id])
+  question Qna?   @relation("Qna")
+  answerId String?
+    createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+}
+model Review{
+  id    String  @id @default(cuid())
+  content String
+  rating Int
+  image String?
+  user  User @relation(fields:  [userId], references: [id])
+  userId String
+  product  Product @relation(fields:  [productId], references: [id])
+  productId String
+  order  Order @relation(fields:  [orderId], references: [id])
+  orderId String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+}
+
+model Order{
+  id    String  @id @default(cuid())
+  user  User @relation(fields:  [userId], references: [id])
+  userId String
+  products Product[]
+  orderNumber String
+  name String
+  address1 String
+  address2 String?
+  zipcode  String
+  phone String
+  message String?
+  reviews Review[]
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+}
+model Basket{
+  id    String  @id @default(cuid())
+  user  User? @relation(fields:  [userId], references: [id])
+  userId String? @unique
+  products Product[]
+}
+model ProductInOrderCount{
+  order  Order @relation(fields:  [orderId], references: [id])
+  orderId String 
+  product  Product @relation(fields:  [productId], references: [id])
+  productId String 
+  @@id([orderId, productId])
+  count Int
+}
```


