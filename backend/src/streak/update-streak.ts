import { PrismaDB } from "../types/prisma";

function toUTCDate(date: Date){
    return new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ));
}

export async function updateWritingStreak(
  prisma: PrismaDB,
  userId: string,
  eventDate: Date
){
  const today = toUTCDate(eventDate);

  const streak = await prisma.writingStreak.findUnique({
    where:{
      userId
    }
  })

  if(!streak){
    await prisma.writingStreak.create({
      data:{
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastWriteDate: today,
      }
    })
    return;
  }

  const lastDate = toUTCDate(streak.lastWriteDate);

  const diffDays = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

  if(diffDays === 0){
    return;
  }

  if(diffDays === 1){
    const newCurrent = streak.currentStreak + 1;

    await prisma.writingStreak.update({
      where:{
        userId
      },
      data:{
        currentStreak: newCurrent,
        longestStreak: Math.max(newCurrent, streak.longestStreak),
        lastWriteDate: today,
      },
    });
    
    return;
  }

  await prisma.writingStreak.update({
    where:{
      userId
    },
    data:{
      currentStreak: 1,
      lastWriteDate: today
    },
  });
}