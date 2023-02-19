import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { nanoid } from 'nanoid';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const limiter = rateLimit({
  windowMs: process.env.RATELIMIT_WINDOW,
  max: process.env.RATELIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(
  cors({
    origin: '*',
  })
);

app.post('/new', async (req, res) => {
  const link = await prisma.link.findFirst({
    where: {
      long: req.body.url,
    },
  });

  if (!link) {
    const short = nanoid(6);

    while (await prisma.link.findFirst({ where: { short: short } })) {
      short = nanoid(6);
    }

    await prisma.link.create({
      data: {
        long: req.body.url,
        short: short,
        createdAt: new Date().toUTCString(),
      },
    });
    res.send(short);
  } else {
    res.send(link.short);
  }
});

app.get('/:short', async (req, res) => {
  const short = req.params.short.replace('?', '');
  if (/^[A-Za-z0-9_-]+$/.test(short)) {
    const link = await prisma.link.findFirst({
      where: {
        short: short,
      },
    });

    if (req.originalUrl.endsWith('?')) {
      const link = await prisma.link.findFirst({
        where: {
          short: short,
        },
      });

      if (link) {
        res.send(link);
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/404`);
      }
    } else if (link) {
      res.redirect(link.long);
      await prisma.link.update({
        where: {
          short: short,
        },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/404`);
    }
  } else {
    res.sendStatus(400);
  }
});

app.listen(process.env.PORT);
